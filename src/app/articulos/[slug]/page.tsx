import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ArticuloDetalle({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const { data: post } = await supabase
        .from('posts')
        .select('*, profiles(nickname)')
        .eq('slug', slug)
        .single();

    if (!post) {
        notFound();
    }

    const cleanContent = post.content
        ? post.content
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00A0/g, ' ')
        : '';

    // Obtener nombre del autor manejando posibles formatos de Supabase o fallos de join
    let authorNickname = Array.isArray(post.profiles)
        ? post.profiles[0]?.nickname
        : post.profiles?.nickname;

    // Fallback: si el join no trajo nada pero tenemos author_id, intentamos fetch directo
    if (!authorNickname && post.author_id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', post.author_id)
            .single();
        authorNickname = profile?.nickname;
    }

    const authorName = authorNickname || 'MANDO CENTRAL';
    const profileSlug = authorNickname || 'mando-central';

    return (
        <main className="min-h-screen flex flex-col bg-void text-white">
            <Navbar />

            <article className="flex-grow max-w-4xl mx-auto w-full border-x border-armor-light bg-paper-dark shadow-2xl relative">

                {/* HERO IMAGE */}
                <div className="relative h-[350px] md:h-[450px] w-full border-b border-armor-light overflow-hidden group">
                    {post.image_url ? (
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-all duration-1000 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-armor flex items-center justify-center text-steel font-heavy text-2xl uppercase tracking-widest">
                            Sin Imagen de Archivo
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-paper-dark via-paper-dark/30 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute bottom-6 left-6 md:left-12 flex items-center gap-3">
                        <span className="bg-blood text-white font-tech text-[10px] px-3 py-1.5 uppercase tracking-widest shadow-lg glow-red">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* ARTICLE BODY */}
                <div className="p-6 md:p-12">

                    {/* META BAR */}
                    <div className="flex flex-col md:flex-row justify-between text-steel font-tech text-xs mb-8 border-b border-armor-light pb-4 gap-4">
                        <div>
                            <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Fecha de Publicación</span>
                            <span className="text-white uppercase">
                                {new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="md:text-right">
                            <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Escrito por</span>
                            <Link
                                href={`/perfil/${profileSlug}`}
                                className="text-white uppercase tracking-wider hover:text-blood transition-colors"
                            >
                                {authorName}
                            </Link>
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="font-shout text-4xl md:text-6xl text-white uppercase leading-[0.9] mb-10 break-words">
                        {post.title}
                    </h1>

                    {/* CONTENT */}
                    <div
                        className="
              prose prose-invert max-w-none 
              whitespace-normal break-words [word-break:normal] text-justify
              prose-headings:font-heavy prose-headings:uppercase prose-headings:text-white
              prose-p:text-gray-300 prose-p:font-body prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
              prose-strong:text-blood prose-strong:font-bold
              prose-a:text-blood prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-sm prose-img:border prose-img:border-armor-light prose-img:max-w-full prose-img:my-8
            "
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />

                    {/* FOOTER NAV */}
                    <div className="mt-12 pt-8 border-t border-armor-light flex justify-between items-center">
                        <Link href="/articulos" className="group flex items-center gap-2 font-tech text-xs text-steel hover:text-white transition-colors uppercase tracking-widest">
                            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                            Volver al Archivo
                        </Link>
                        <div className="font-tech text-[10px] text-blood">
                            FIN DEL DOCUMENTO
                        </div>
                    </div>

                </div>

            </article>

            <Footer />
        </main>
    );
}
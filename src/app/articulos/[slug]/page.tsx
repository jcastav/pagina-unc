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
                <div className="relative h-[350px] md:h-[450px] w-full border-b border-armor-light overflow-hidden">
                    {post.image_url ? (
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
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
                            <span className="text-white uppercase font-bold">
                                {new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="md:text-right flex flex-col md:items-end justify-end">
                            <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Escrito por</span>
                            {authorNickname ? (
                                <Link
                                    href={`/perfil/${profileSlug}`}
                                    className="inline-flex items-center gap-1.5 text-white uppercase tracking-wider hover:text-blood transition-colors font-bold group"
                                >
                                    <span className="underline decoration-armor-light group-hover:decoration-blood transition-all">{authorName}</span>
                                    <span className="text-[10px] text-armor group-hover:text-blood transition-colors">&rarr;</span>
                                </Link>
                            ) : (
                                <span className="text-steel uppercase tracking-wider">
                                    {authorName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="font-shout text-4xl md:text-6xl text-white uppercase leading-[0.9] mb-10 break-words">
                        {post.title}
                    </h1>

                    {/* DOCUMENTO DE DOCTRINA ADJUNTO */}
                    {post.category === "DOCTRINA" && post.document_url && (
                        <div className="mb-10 bg-blood/5 border border-blood/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-left">
                                <div className="w-12 h-12 bg-blood/10 flex items-center justify-center border border-blood/30 shrink-0">
                                    <svg className="w-6 h-6 text-blood" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-heavy text-sm text-white uppercase">Documento Oficial Disponible</h4>
                                    <p className="font-body text-xs text-gray-500 max-w-md">Estudie el texto doctrinario en su formato original (.PDF, .DOCX) descargándolo de nuestros servidores.</p>
                                </div>
                            </div>
                            <a
                                href={post.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto text-center bg-white text-void hover:bg-blood hover:text-white font-heavy text-xs uppercase py-4 px-8 tracking-widest transition-all shrink-0 border border-transparent hover:border-blood"
                            >
                                Descargar Archivo
                            </a>
                        </div>
                    )}

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
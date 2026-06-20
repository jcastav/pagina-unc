import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctrinaGrid from "@/components/DoctrinaGrid";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function DoctrinaPage() {

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'DOCTRINA')
        .eq('status', 'PUBLICADO')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-void text-white flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light p-6 md:p-12">

                {/* HEADER */}
                <div className="mb-12 border-b border-armor-light pb-6 text-center">
                    <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">Pilares Ideológicos</span>
                    <h1 className="font-shout text-5xl md:text-7xl text-white uppercase mb-4 leading-none">
                        Doctrina & Pensamiento
                    </h1>
                    <p className="font-body text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
                        Fundamentos del movimiento nacionalista. Documentos que definen nuestra postura
                        ideológica, principios y visión para el futuro de Colombia.
                    </p>
                </div>

                {/* GRID */}
                <DoctrinaGrid posts={posts || []} />

            </div>
            <Footer />
        </main>
    );
}
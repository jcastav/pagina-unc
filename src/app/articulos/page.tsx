import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticulosGrid from "@/components/ArticulosGrid";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function ArticulosPage() {

    const { data: posts } = await supabase
        .from('posts')
        .select('*, profiles(nickname)')
        .eq('status', 'PUBLICADO')
        .neq('category', 'DOCTRINA')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-void text-white flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light p-6 md:p-12">

                {/* HEADER */}
                <div className="mb-12 border-b border-armor-light pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">Base de Datos</span>
                        <h1 className="font-shout text-5xl md:text-7xl text-white uppercase leading-none">
                            Archivo Central
                        </h1>
                    </div>
                    <p className="font-tech text-xs text-gray-500 max-w-xs uppercase tracking-tighter">
                        [ TODOS LOS ARTÍCULOS, COMUNICADOS Y DOCUMENTOS PUBLICADOS ]
                    </p>
                </div>

                {/* GRID */}
                <ArticulosGrid posts={posts || []} />

            </div>
            <Footer />
        </main>
    );
}
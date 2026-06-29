import Navbar from "@/components/Navbar";
import HeroNews from "@/components/HeroNews";
import NewsGrid from "@/components/NewsGrid";
import SupplyStore from "@/components/SupplyStore";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function Home() {

  // 1. BUSCAR EL COMUNICADO OFICIAL MÁS RECIENTE (Para el Hero Grande)
  const { data: oficialPosts } = await supabase
    .from('posts')
    .select('*, profiles(nickname)')
    .eq('category', 'OFICIAL')
    .eq('status', 'PUBLICADO')
    .order('created_at', { ascending: false })
    .limit(1);

  const mainPost = oficialPosts && oficialPosts.length > 0 ? oficialPosts[0] : null;

  // 2. BUSCAR EL RESTO DE ARTÍCULOS (Para el Grid de abajo)
  const { data: gridPosts } = await supabase
    .from('posts')
    .select('*, profiles(nickname)')
    .neq('category', 'OFICIAL')
    .neq('category', 'DOCTRINA')
    .eq('status', 'PUBLICADO')
    .order('created_at', { ascending: false })
    .limit(6);

  // 3. BUSCAR LA BITÁCORA (Para el Sidebar del Hero)
  const { data: bitacoraLog } = await supabase
    .from('posts')
    .select('title, created_at, category, slug')
    .neq('category', 'DOCTRINA')
    .eq('status', 'PUBLICADO')
    .order('created_at', { ascending: false })
    .limit(8);

  // 4. BUSCAR PRODUCTOS (Para la Tienda)
  const { data: storeProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen flex flex-col bg-void">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full border-x border-armor-light bg-void flex-grow shadow-2xl relative z-10">

        {/* SECCIÓN SUPERIOR: HERO INTEGRAL */}
        <HeroNews post={mainPost} bitacoraLog={bitacoraLog || []} />

        {/* SECCIÓN INFERIOR: EL RESTO DE NOTICIAS */}
        <NewsGrid posts={gridPosts || []} />

        <SupplyStore products={storeProducts || []} />

      </div>

      <Footer />
    </main>
  );
}
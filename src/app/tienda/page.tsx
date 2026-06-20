import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupplyStore from "@/components/SupplyStore";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function TiendaPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const displayProducts = products || [];

  if (error) {
    console.error('Error fetching products:', error);
    return (
      <main className="min-h-screen flex flex-col bg-void text-white">
        <Navbar />
        <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light shadow-2xl">
          <div className="p-12 text-center">
            <p className="font-tech text-blood uppercase text-xs tracking-widest">[ ERROR AL ACCEDER AL INVENTARIO. REINTENTE MÁS TARDE ]</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-void text-white">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light shadow-2xl">
        <SupplyStore products={displayProducts} />

        <div className="p-12 text-center border-t border-armor-light scanline">
          <p className="font-tech text-gray-500 uppercase text-[10px] tracking-widest">
            [ MÁS ÍTEMS EN PRODUCCIÓN. PRÓXIMAMENTE EN INVENTARIO ]
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
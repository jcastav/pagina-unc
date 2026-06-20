"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Package, DollarSign, Hash, Camera, FileText, Loader2, Send, Check } from "lucide-react";

export default function IntendenciaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/comando"); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'ROOT' && profile?.role !== 'COMANDO') {
        alert("ACCESO DENEGADO: SOLO PERSONAL DE LOGÍSTICA.");
        router.push("/perfil");
      } else {
        // Fetch existing products
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (prods) setProducts(prods);
        setLoading(false);
      }
    };
    checkAccess();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleAvailability = async (productId: string, currentVal: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !currentVal })
      .eq('id', productId);
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, is_available: !currentVal } : p));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const stock = formData.get("stock") as string;

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('merch')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('merch')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { data: newProduct, error: dbError } = await supabase
        .from('products')
        .insert([{
          name,
          price: parseFloat(price),
          description,
          image_url: imageUrl,
          stock: parseInt(stock) || 0,
          is_available: true
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      alert("¡SUMINISTRO AGREGADO AL INVENTARIO!");
      if (newProduct) setProducts([newProduct, ...products]);
      (e.target as HTMLFormElement).reset();
      setPreviewUrl(null);
      setImageFile(null);

    } catch (error: any) {
      console.error("Error logística:", error);
      alert("ERROR: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <Package className="mx-auto text-blood mb-4 animate-pulse" size={36} />
        <p className="font-tech text-blood text-xs tracking-[0.3em] uppercase animate-pulse">Cargando Logística...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-void text-white p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/comando/dashboard" className="inline-flex items-center gap-2 font-tech text-[10px] text-steel hover:text-white transition-colors uppercase tracking-widest mb-4 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </Link>
          <div className="border-b border-armor-light pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={14} className="text-blood" />
              <span className="font-tech text-blood text-[10px] tracking-[0.3em] uppercase font-bold">Logística e Inventario</span>
            </div>
            <h1 className="font-shout text-3xl md:text-5xl uppercase leading-none">Gestión de Tienda</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* FORM — 3 columns */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8 bg-paper-dark/30 p-8 border border-armor-light">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Package size={10} className="text-blood" /> Nombre del Producto
                  </label>
                  <input required name="name" type="text" className="w-full bg-void/50 border border-armor-light p-4 text-white font-bold text-lg focus:border-blood outline-none uppercase placeholder-gray-700 transition-all" placeholder="EJ: CAMISETA INSTITUCIONAL" />
                </div>
                <div>
                  <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={10} className="text-blood" /> Precio Unitario (COP)
                  </label>
                  <input required name="price" type="number" className="w-full bg-void/50 border border-armor-light p-4 text-white font-tech text-lg focus:border-blood outline-none placeholder-gray-700 transition-all" placeholder="50000" />
                </div>
              </div>

              <div>
                <label className="font-tech text-[10px] text-green-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={10} /> Stock Inicial
                </label>
                <input required name="stock" type="number" className="w-full bg-void/50 border border-green-900/50 p-4 text-green-400 font-tech text-lg focus:border-green-500 outline-none placeholder-gray-700 transition-all" placeholder="Ej: 50" />
              </div>

              <div>
                <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={10} className="text-blood" /> Especificaciones
                </label>
                <textarea name="description" rows={3} className="w-full bg-void/50 border border-armor-light p-4 text-gray-300 font-body text-sm focus:border-blood outline-none transition-all" placeholder="Material, tallas disponibles, detalles..."></textarea>
              </div>

              <div>
                <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Camera size={10} className="text-blood" /> Fotografía del Producto
                </label>
                <div className="flex items-start gap-6">
                  <input required type="file" accept="image/*" onChange={handleImageChange} className="w-full font-tech text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-armor-light file:text-white hover:file:bg-blood file:cursor-pointer file:transition-colors cursor-pointer" />
                  {previewUrl && (
                    <div className="relative h-24 w-24 border border-armor-light shrink-0 overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={submitting}
                className="w-full bg-white text-void font-heavy text-lg uppercase py-4 hover:bg-blood hover:text-white transition-all disabled:opacity-50 glow-red-hover flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> REGISTRANDO...</>
                ) : (
                  <><Send size={16} /> AGREGAR AL CATÁLOGO</>
                )}
              </motion.button>
            </form>
          </div>

          {/* INVENTORY SIDEBAR — 2 columns */}
          <div className="lg:col-span-2">
            <div className="border border-armor-light bg-paper-dark/30 p-6">
              <h3 className="font-heavy text-lg uppercase text-white mb-4 pb-3 border-b border-armor-light flex items-center gap-2">
                <Package size={16} className="text-blood" />
                Inventario Actual
                <span className="ml-auto font-tech text-[10px] text-steel">{products.length} items</span>
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {products.length > 0 ? products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 border border-armor/50 hover:border-armor-light transition-colors bg-void/30">
                    {p.image_url ? (
                      <div className="relative w-12 h-12 shrink-0 border border-armor-light overflow-hidden">
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 shrink-0 border border-armor-light flex items-center justify-center bg-armor/30">
                        <Package size={16} className="text-steel" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <p className="font-heavy text-xs text-white uppercase truncate">{p.name}</p>
                      <p className="font-tech text-[9px] text-steel">
                        ${p.price?.toLocaleString()} · Stock: <span className={p.stock > 0 ? 'text-green-400' : 'text-blood'}>{p.stock}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAvailability(p.id, p.is_available)}
                      className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-all ${p.is_available
                          ? 'border-green-600 text-green-500 hover:bg-green-500/10'
                          : 'border-armor text-gray-600 hover:border-blood hover:text-blood'
                        }`}
                      title={p.is_available ? "Disponible — Click para desactivar" : "No disponible — Click para activar"}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                )) : (
                  <p className="font-tech text-xs text-gray-600 text-center py-8 uppercase">Sin productos registrados</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </main>
  );
}
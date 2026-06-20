"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Editor from "@/components/Editor";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Tag, Camera, AlertTriangle, Send, Loader2 } from "lucide-react";

export default function RedaccionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center font-tech text-blood animate-pulse text-xs tracking-[0.3em] uppercase">
        Cargando Centro Editorial...
      </div>
    }>
      <RedaccionContent />
    </Suspense>
  );
}

function RedaccionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("OPINIÓN");
  const [content, setContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/comando"); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'ROOT' && profile?.role !== 'COMANDO') {
        alert("ACCESO DENEGADO.");
        router.push("/perfil");
        return;
      }

      if (editId) {
        const { data: post, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', editId)
          .single();

        if (post && !error) {
          setTitle(post.title);
          setCategory(post.category);
          setContent(post.content);
          setCurrentImageUrl(post.image_url);
          setAdminFeedback(post.admin_feedback);
        }
      }
      setLoading(false);
    };
    init();
  }, [router, editId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!content || content === "<p><br></p>") {
      alert("El documento no puede estar vacío.");
      setSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = currentImageUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('noticias')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('noticias')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (editId) {
        const { error } = await supabase
          .from('posts')
          .update({ title, content, category, image_url: finalImageUrl, status: 'PUBLICADO' })
          .eq('id', editId);
        if (error) throw error;
        alert("¡ARCHIVO ACTUALIZADO CORRECTAMENTE!");
      } else {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const { error } = await supabase
          .from('posts')
          .insert([{ title, slug, content, category, image_url: finalImageUrl, author_id: user?.id, status: 'PUBLICADO' }]);
        if (error) throw error;
        alert("¡DOCUMENTO PUBLICADO CON ÉXITO!");
      }

      router.push("/comando/dashboard");
    } catch (error: any) {
      console.error("Error guardando:", error);
      alert("ERROR: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <Loader2 className="text-blood animate-spin" size={32} />
    </div>
  );

  const categoryColors: Record<string, string> = {
    'OPINIÓN': 'border-blue-500 text-blue-400',
    'ECONOMÍA': 'border-green-500 text-green-400',
    'SEGURIDAD': 'border-yellow-500 text-yellow-400',
    'DOCTRINA': 'border-purple-500 text-purple-400',
    'OFICIAL': 'border-blood text-blood',
  };

  return (
    <main className="min-h-screen bg-void text-white p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* BREADCRUMB + HEADER */}
        <div className="mb-8">
          <Link href="/comando/dashboard" className="inline-flex items-center gap-2 font-tech text-[10px] text-steel hover:text-white transition-colors uppercase tracking-widest mb-4 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </Link>
          <div className="border-b border-armor-light pb-4 flex justify-between items-end">
            <div>
              <h1 className="font-shout text-3xl md:text-5xl uppercase leading-none">
                {editId ? "Editar Artículo" : "Nuevo Artículo"}
              </h1>
              <p className="font-tech text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                {editId ? `REF: ${editId.slice(0, 8)}...` : "Redacción de nuevo contenido"}
              </p>
            </div>
            {/* CATEGORY PREVIEW BADGE */}
            <span className={`font-tech text-[10px] px-3 py-1 border uppercase tracking-wider hidden md:inline-block ${categoryColors[category] || 'border-armor text-steel'}`}>
              {category}
            </span>
          </div>
        </div>

        {/* ADMIN FEEDBACK ALERT */}
        {adminFeedback && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blood/5 border border-blood/30 p-5 mb-8 flex gap-4 items-start"
          >
            <AlertTriangle className="text-blood shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-blood font-heavy text-sm uppercase mb-1">Observaciones Editoriales</h4>
              <p className="text-gray-300 font-body text-sm leading-relaxed">{adminFeedback}</p>
            </div>
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* TITLE */}
          <div>
            <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
              <FileText size={10} className="text-blood" />
              Titular del Documento
            </label>
            <input
              required type="text" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-paper-dark/50 border border-armor-light p-4 text-white font-shout text-2xl md:text-4xl focus:border-blood outline-none uppercase placeholder-gray-700 transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.05)]"
              placeholder="..."
            />
          </div>

          {/* CATEGORY + IMAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                <Tag size={10} className="text-blood" />
                Categoría
              </label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-void/50 border border-armor-light p-4 text-white font-heavy focus:border-blood outline-none transition-all"
              >
                <option value="OPINIÓN">OPINIÓN</option>
                <option value="ECONOMÍA">ECONOMÍA</option>
                <option value="SEGURIDAD">SEGURIDAD</option>
                <option value="DOCTRINA">DOCTRINA</option>
                <option value="OFICIAL">COMUNICADO OFICIAL</option>
              </select>
            </div>

            <div>
              <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                <Camera size={10} className="text-blood" />
                Fotografía
              </label>
              <input
                type="file" accept="image/*"
                onChange={handleImageChange}
                className="w-full font-tech text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-armor-light file:text-white hover:file:bg-blood file:cursor-pointer file:transition-colors cursor-pointer"
              />
              {(previewUrl || currentImageUrl) && (
                <div className="mt-4 relative h-32 w-full border border-armor-light overflow-hidden">
                  <Image
                    src={previewUrl || currentImageUrl || ""} alt="Preview" fill
                    className="object-cover opacity-70"
                  />
                  <span className="absolute bottom-2 right-2 bg-void/80 backdrop-blur-sm text-[9px] font-tech px-2 py-1 text-steel">VISTA ACTUAL</span>
                </div>
              )}
            </div>
          </div>

          {/* EDITOR */}
          <div>
            <label className="font-tech text-[10px] text-steel mb-2 uppercase tracking-widest block">
              Cuerpo del Documento
            </label>
            <div className="border border-armor-light bg-white text-black">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          {/* SUBMIT */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-void font-heavy text-xl uppercase py-6 hover:bg-blood hover:text-white transition-all disabled:opacity-50 glow-red-hover flex items-center justify-center gap-3"
          >
            {submitting ? (
              <><Loader2 size={20} className="animate-spin" /> PROCESANDO...</>
            ) : (
              <><Send size={18} /> {editId ? "GUARDAR CAMBIOS" : "PUBLICAR DOCUMENTO"}</>
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
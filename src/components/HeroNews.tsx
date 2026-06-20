'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Activity, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroNewsProps {
  post: any;
  bitacoraLog?: any[];
}

export default function HeroNews({ post, bitacoraLog: initialBitacora }: HeroNewsProps) {
  const [bitacora, setBitacora] = useState(initialBitacora || []);

  if (!post) {
    return null;
  }

  // Obtener nombre del autor manejando posibles formatos de Supabase
  const authorNickname = Array.isArray(post.profiles)
    ? post.profiles[0]?.nickname
    : post.profiles?.nickname;

  const authorName = authorNickname || 'UNC';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-armor-light min-h-[650px] bg-void overflow-hidden">

      {/* MAIN CONTENT AREA */}
      <div className="lg:col-span-8 relative group border-r border-armor-light flex flex-col justify-end p-6 md:p-20 overflow-hidden">

        {/* BACKGROUND IMAGE WITH PREMIUM OVERLAYS */}
        {post.image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover opacity-20 group-hover:opacity-30 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent"></div>
          </div>
        )}

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="bg-white text-void font-heavy text-[9px] px-4 py-1.5 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap size={10} fill="currentColor" className="text-blood" />
              {post.category || 'COMUNICADO'}
            </span>
            <div className="h-px w-12 bg-armor-light"></div>
            <span className="text-steel font-tech text-[9px] uppercase tracking-[0.2em]">
              EMISIÓN: {new Date(post.created_at).toLocaleDateString()}
            </span>
          </motion.div>

          <h2 className="font-shout text-5xl md:text-[90px] uppercase leading-[0.8] mb-10 text-white group-hover:text-blood transition-colors duration-500 max-w-5xl tracking-tighter">
            {post.title}
          </h2>

          <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12">
            <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl border-l-[3px] border-blood pl-8 line-clamp-3">
              {post.content?.replace(/<[^>]+>/g, ' ')}
            </p>
            <div className="hidden xl:flex flex-col gap-2 pt-1 border-l border-armor-light pl-8 text-steel font-tech text-[9px] uppercase tracking-widest leading-relaxed">
              <span className="text-white font-bold opacity-50 italic">PUBLICACIÓN OFICIAL</span>
              <Link
                href={`/perfil/${authorNickname || 'unc'}`}
                className="hover:text-blood transition-colors flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                AUTOR: {authorName}
              </Link>
              <span className="flex items-center gap-2">NIVEL: {post.category || 'INFORMATIVO'}</span>
            </div>
          </div>

          <Link href={`/articulos/${post.slug}`} className="group/btn relative inline-flex items-center gap-6 bg-blood text-white px-10 py-5 font-heavy text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-void transition-all overflow-hidden border border-blood">
            <span className="relative z-10">Leer Comunicado</span>
            <ChevronRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300"></div>
          </Link>
        </motion.div>

        {/* INSTITUTIONAL DECORATION */}
        {/* <div className="absolute top-12 left-12 opacity-10 hidden md:block">
           <span className="font-shout text-4xl text-white select-none">UNC-SYSTEM_PR</span>
        </div> */}
      </div>

      {/* SIDEBAR: ÚLTIMAS NOTICIAS */}
      <div className="lg:col-span-4 bg-paper-dark/30 flex flex-col relative overflow-hidden">

        {/* SIDEBAR HEADER */}
        <div className="p-8 border-b border-armor-light flex items-center justify-between bg-armor/10">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-blood animate-pulse" />
            <span className="font-tech text-xs text-white uppercase tracking-[0.2em] font-bold">Últimas Noticias</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-blood shadow-[0_0_10px_#ef4444]"></div>
        </div>

        <div className="flex-1 p-8 space-y-10 overflow-y-auto max-h-[600px] custom-scrollbar">
          {bitacora.length > 0 ? bitacora.map((log, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              key={index}
              className="group relative pl-8 border-l border-armor-light hover:border-blood transition-colors"
            >
              <div className="absolute -left-[4px] top-0 w-2 h-2 bg-void border border-armor-light group-hover:bg-blood group-hover:border-blood transition-colors"></div>

              <div className="flex items-center gap-3 mb-3">
                <span className="font-tech text-[9px] text-blood font-bold uppercase tracking-widest">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-armor"></span>
                <span className="font-tech text-[8px] text-steel uppercase tracking-widest">
                  {log.category}
                </span>
              </div>

              <Link href={`/articulos/${log.slug}`} className="font-heavy text-base md:text-lg text-white leading-tight hover:text-blood transition-colors block uppercase tracking-tight">
                {log.title}
              </Link>
            </motion.div>
          )) : (
            <div className="text-center py-10 opacity-30">
              <p className="font-tech text-[9px] uppercase tracking-widest">Actualizando registros de prensa...</p>
            </div>
          )}
        </div>

        <Link href="/articulos" className="p-8 bg-blood text-white text-center group hover:bg-white transition-all border-t border-blood">
          <span className="font-heavy text-xs text-white group-hover:text-void transition-colors uppercase tracking-[0.2em]">
            Archivo de Prensa ➔
          </span>
        </Link>
      </div>
    </section>
  );
}
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
    return (
      <section className="min-h-[400px] flex items-center justify-center border-b border-armor-light scanline bg-void">
        <div className="text-center p-12">
          <Activity className="mx-auto text-armor mb-4 animate-pulse" size={48} />
          <h2 className="font-shout text-4xl text-armor uppercase tracking-widest">Esperando Comunicado...</h2>
        </div>
      </section>
    );
  }

  // Obtener nombre del autor manejando posibles formatos de Supabase
  const authorNickname = Array.isArray(post.profiles)
    ? post.profiles[0]?.nickname
    : post.profiles?.nickname;

  const authorName = authorNickname || 'MANDO CENTRAL';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-armor-light min-h-[600px] bg-void overflow-hidden">

      {/* MAIN CONTENT AREA */}
      <div className="lg:col-span-8 relative group border-r border-armor-light flex flex-col justify-end p-6 md:p-16 overflow-hidden">

        {/* BACKGROUND IMAGE WITH PREMIUM OVERLAYS */}
        {post.image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover opacity-30 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-void/40 to-transparent"></div>
          </div>
        )}

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="bg-blood text-white font-tech text-[10px] px-3 py-1 uppercase tracking-widest flex items-center gap-2 glow-red">
              <Zap size={10} fill="currentColor" />
              {post.category || 'OFICIAL'} // COMUNICADO
            </span>
            <span className="text-steel font-tech text-[10px] uppercase tracking-tighter">
              REF: UNC-{post.id?.toString().slice(0, 4) || '777'}
            </span>
          </motion.div>

          <h2 className="font-shout text-5xl md:text-8xl uppercase leading-[0.85] mb-8 text-white group-hover:text-blood transition-colors duration-500 drop-shadow-2xl max-w-4xl">
            {post.title}
          </h2>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <p className="font-body text-gray-400 text-lg leading-relaxed max-w-xl border-l-2 border-blood/50 pl-6 line-clamp-3">
              {post.content?.replace(/<[^>]+>/g, ' ')}
            </p>
            <div className="hidden xl:block w-px h-12 bg-armor"></div>
            <div className="hidden xl:flex flex-col gap-1 text-steel font-tech text-[10px] uppercase">
              <span>Prioridad: ALTA</span>
              <Link
                href={`/perfil/${authorNickname || 'mando-central'}`}
                className="hover:text-blood transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Agente: {authorName}
              </Link>
              <span>Estado: DIFUNDIÉNDOSE</span>
            </div>
          </div>

          <Link href={`/articulos/${post.slug}`} className="group/btn relative inline-flex items-center gap-4 bg-white text-void px-8 py-4 font-heavy text-sm uppercase tracking-widest hover:bg-blood hover:text-white transition-all overflow-hidden">
            <span className="relative z-10">Leer Informe Completo</span>
            <ChevronRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-blood translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300"></div>
          </Link>
        </motion.div>

        {/* TECH DECORATION */}
        <div className="absolute top-8 right-8 hidden md:block">
          <div className="border-tech p-4 opacity-20">
            <Activity size={24} className="text-blood animate-pulse" />
          </div>
        </div>
      </div>

      {/* SIDEBAR: BITÁCORA / FEED */}
      <div className="lg:col-span-4 bg-paper-dark/50 flex flex-col scanline">
        <div className="bg-armor/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-armor-light">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-blood" />
            <span className="font-tech text-[11px] text-white uppercase tracking-widest font-bold">Bitácora Global</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-blood animate-ping"></div>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[600px] custom-scrollbar">
          {bitacora.length > 0 ? bitacora.map((log, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              key={index}
              className="group relative pl-6 border-l border-armor-light hover:border-blood transition-colors"
            >
              <div className="absolute -left-[4.5px] top-0 w-2 h-2 bg-void border border-armor-light rounded-full group-hover:bg-blood group-hover:border-blood transition-colors"></div>

              <div className="flex items-center gap-3 mb-2">
                <span className="font-tech text-[9px] text-blood/80 font-bold uppercase tracking-tighter">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-armor"></span>
                <span className="font-tech text-[9px] text-steel uppercase">
                  {log.category}
                </span>
              </div>

              <Link href={`/articulos/${log.slug}`} className="font-heavy text-xs md:text-sm text-steel-light leading-tight hover:text-white transition-colors block uppercase">
                {log.title}
              </Link>
            </motion.div>
          )) : (
            <div className="text-center py-10 opacity-20">
              <p className="font-tech text-[10px] uppercase">Cargando flujos de datos...</p>
            </div>
          )}
        </div>

        <Link href="/articulos" className="p-4 bg-void/80 border-t border-armor-light text-center group">
          <span className="font-tech text-[10px] text-steel group-hover:text-blood transition-colors uppercase tracking-widest">
            Acceder al Archivo Histórico [-&gt;]
          </span>
        </Link>
      </div>
    </section>
  );
}
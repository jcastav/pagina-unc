"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ShieldCheck, Instagram, Facebook, Twitter,
  Youtube, Send, AtSign, Music2, User, ChevronRight, LayoutDashboard
} from "lucide-react";

export default function Footer() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchRole(userId: string) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data) setRole(data.role);
  }

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/unionnacionalista', active: true },
    { name: 'TikTok', icon: Music2, href: 'https://www.tiktok.com/@unionnacionalistacol?_r=1&_t=ZS-943uTZeIfyP', active: true },
    { name: 'Twitter / X', icon: Twitter, href: 'https://x.com/unionnacionalco', active: true },
    { name: 'Telegram', icon: Send, href: 'https://t.me/nacionalismoUNC', active: true },
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/UnionNacionalistaColombiana', active: true },
    { name: 'YouTube', icon: Youtube, href: '#', active: false },
    { name: 'Threads', icon: AtSign, href: 'https://www.threads.com/@unionnacionalista', active: true },
  ];

  return (
    <footer className="border-t border-armor-light bg-void py-16 px-6 relative overflow-hidden">
      {/* DECORATIVE ELEMENT */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <h2 className="font-shout text-[20vw] leading-none uppercase select-none">UNC</h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">

        {/* INFO COLUMN */}
        <div className="md:col-span-12 lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blood flex items-center justify-center">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <h4 className="font-shout text-2xl uppercase tracking-tight">UNC PLATAFORMA</h4>
          </div>
          <p className="font-body text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
            Portal oficial de la Unión Nacionalista de Colombia. Impulsando el orden, la soberanía y la renovación nacional.
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.active ? social.href : undefined}
                target="_blank"
                rel="noopener noreferrer"
                title={social.active ? social.name : `${social.name} - Próximamente`}
                className={`w-10 h-10 border flex items-center justify-center transition-all ${social.active
                  ? 'border-armor-light text-steel hover:text-white hover:border-blood hover:bg-blood/10'
                  : 'border-armor/20 text-armor opacity-30 cursor-not-allowed'
                  }`}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* LINKS COLUMN */}
        <div className="md:col-span-3">
          <h5 className="font-tech text-xs text-blood uppercase tracking-widest font-bold mb-6">Navegación</h5>
          <ul className="space-y-4">
            <li><Link href="/articulos" className="font-heavy text-xs uppercase text-steel hover:text-white transition-colors">Informes de Prensa</Link></li>
            <li><Link href="/doctrina" className="font-heavy text-xs uppercase text-steel hover:text-white transition-colors">Nuestra Doctrina</Link></li>
            <li><Link href="/tienda" className="font-heavy text-xs uppercase text-steel hover:text-white transition-colors">Tienda</Link></li>
          </ul>
        </div>

        {/* ACCESS COLUMN - DYNAMIC */}
        <div className="md:col-span-4 bg-armor/10 border border-armor-light p-8">
          {user ? (
            <div className="space-y-6">
              <h5 className="font-tech text-xs text-white uppercase tracking-widest font-bold flex items-center gap-2">
                <User size={14} className="text-blood" />
                Miembro Activo
              </h5>
              <div className="bg-void/50 p-4 border border-armor-light">
                <span className="font-tech text-[9px] text-steel uppercase block mb-1">Rango</span>
                <span className="font-heavy text-white uppercase">{role || 'Cargando...'}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/perfil" className="flex items-center justify-between bg-blood text-white px-6 py-3 font-heavy text-[10px] uppercase tracking-widest hover:bg-white hover:text-void transition-all group">
                  Ir a Mi Perfil
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                {(role === 'ROOT' || role === 'COMANDO') && (
                  <Link href="/comando/dashboard" className="flex items-center justify-between border border-blood text-blood px-6 py-3 font-heavy text-[10px] uppercase tracking-widest hover:bg-blood hover:text-white transition-all group">
                    Panel de Mando
                    <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              <h5 className="font-tech text-xs text-white uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blood" />
                Acceso Institucional
              </h5>
              <p className="text-[11px] text-gray-500 font-body leading-relaxed mb-6">
                Espacio reservado para la gestión editorial y administrativa de la plataforma.
              </p>
              <Link href="/login" className="inline-block font-tech text-[10px] text-white border border-armor-light bg-void px-6 py-3 hover:bg-blood hover:border-blood transition-all uppercase tracking-widest w-full text-center">
                Entrar al Panel
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-armor-light flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-tech text-[9px] text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} UNC | UNION NACIONALISTA COLOMBIANA
        </p>
        <div className="flex gap-6">
          <Link href="/privacidad" className="font-tech text-[9px] text-armor hover:text-white uppercase transition-colors">Privacidad</Link>
          <Link href="/terminos" className="font-tech text-[9px] text-armor hover:text-white uppercase transition-colors">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
}

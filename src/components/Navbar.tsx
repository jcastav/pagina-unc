'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, Share2,
  Instagram, Facebook, Twitter, Youtube, Send, AtSign, Music2,
  ChevronDown, ExternalLink, Sparkles, User, LogOut
} from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Artículos', href: '/articulos' },
    { name: 'Doctrina', href: '/doctrina' },
    { name: 'Tienda', href: '/tienda' },
  ];

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
    <nav className="sticky top-0 z-50 glass border-b-2 border-armor-light px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-4 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            className="w-12 h-12 relative flex items-center justify-center"
          >
            <Image
              src="/logo11.png"
              alt="Logo UNC"
              width={48}
              height={48}
              className="object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="font-shout text-2xl md:text-3xl leading-none tracking-tight group-hover:text-blood transition-colors">
              UNIONNACIONALISTA<span className="text-blood">.ORG</span>
            </h1>
            <span className="font-tech text-[9px] text-steel tracking-[0.4em] block uppercase">
              Patria · Orden
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-heavy text-sm uppercase tracking-wider text-steel hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {/* AUTH SECTION */}
          {user && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-armor-light">
              <Link href="/perfil" className="flex items-center gap-2 font-heavy text-[10px] uppercase tracking-widest text-white hover:text-blood transition-colors">
                <User size={14} />
                <span>Mi Cuenta</span>
              </Link>
              <button onClick={handleLogout} className="text-steel hover:text-blood transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* SOCIAL HUB DROPDOWN */}
          <div className="relative" onMouseEnter={() => setShowSocials(true)} onMouseLeave={() => setShowSocials(false)}>
            <button className={`flex items-center gap-2 font-heavy text-sm uppercase tracking-wider transition-colors ${showSocials ? 'text-blood' : 'text-steel hover:text-white'}`}>
              <Share2 size={16} />
              <span>Canales</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${showSocials ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSocials && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full pt-4 w-64"
                >
                  <div className="bg-void/95 backdrop-blur-xl border border-armor-light shadow-2xl p-4 glow-red">
                    <div className="text-[10px] font-tech text-armor-light uppercase mb-4 tracking-[0.2em] flex items-center gap-2 border-b border-armor-light pb-2">
                      <Sparkles size={10} className="text-blood" />
                      Red de Difusión
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.active ? social.href : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3 transition-all ${social.active
                            ? 'hover:bg-blood hover:text-white group/item'
                            : 'opacity-40 cursor-not-allowed grayscale'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <social.icon size={18} className={social.active ? 'text-blood group-hover/item:text-white' : ''} />
                            <span className="font-heavy text-xs uppercase tracking-tight">{social.name}</span>
                          </div>
                          {!social.active ? (
                            <span className="font-tech text-[8px] border border-armor px-1">SOON</span>
                          ) : (
                            <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 hover:bg-armor rounded-lg transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-void/95 backdrop-blur-xl border-t border-armor mt-4"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex justify-between items-center font-heavy text-xl uppercase py-4 border-b border-armor/50 text-steel hover:text-blood transition-colors"
                >
                  {link.name}
                  <ChevronRight size={20} className="text-armor" />
                </Link>
              ))}

              {/* Botones de Cuenta en Móvil */}
              {user && (
                <div className="mt-4 pt-4 border-t border-armor/50">
                  <div className="space-y-4">
                    <Link 
                      href="/perfil" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 font-heavy text-lg uppercase text-white hover:text-blood"
                    >
                      <User size={20} />
                      <span>Mi Cuenta</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 font-heavy text-lg uppercase text-steel hover:text-blood w-full text-left"
                    >
                      <LogOut size={20} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MOBILE SOCIAL HUB */}
              <div className="py-6 space-y-4">
                <span className="font-tech text-[10px] text-armor-light uppercase tracking-[0.3em] block">Nuestros Canales</span>
                <div className="grid grid-cols-4 gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.active ? social.href : undefined}
                      className={`w-12 h-12 flex items-center justify-center border border-armor-light ${social.active ? 'text-white hover:border-blood hover:text-blood transition-all' : 'opacity-20 pointer-events-none'}`}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
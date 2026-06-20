"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, PenTool, Package, LogOut, Activity, FileText, ShoppingBag, ChevronRight, Shield } from "lucide-react";
import ArticleManager from "@/components/ArticleManager";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, posts: 0, products: 0 });

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/comando"); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data?.role !== 'ROOT' && data?.role !== 'COMANDO') {
        router.push("/comando/perfil");
      } else {
        setProfile(data);

        // Fetch stats
        const [usersRes, postsRes, productsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          users: usersRes.count || 0,
          posts: postsRes.count || 0,
          products: productsRes.count || 0,
        });

        setLoading(false);
      }
    };
    checkAccess();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <Activity className="mx-auto text-blood mb-4 animate-pulse" size={40} />
        <p className="font-tech text-blood text-xs tracking-[0.3em] uppercase animate-pulse">Iniciando Sistemas de Mando...</p>
      </div>
    </div>
  );

  const commandCards = [
    {
      title: "Gestión de Tropas",
      subtitle: "VISUALIZAR PERSONAL, RANGOS Y EFECTIVOS",
      href: "/comando/afiliados",
      icon: Users,
      stat: stats.users,
      statLabel: "Efectivos",
    },
    {
      title: "Redacción",
      subtitle: "PUBLICAR COMUNICADOS, NOTICIAS Y DOCTRINA",
      href: "/comando/redaccion",
      icon: PenTool,
      stat: stats.posts,
      statLabel: "Publicaciones",
    },
    {
      title: "Intendencia",
      subtitle: "ABASTECIMIENTO Y CONTROL DE TIENDA",
      href: "/comando/intendencia",
      icon: Package,
      stat: stats.products,
      statLabel: "Productos",
    },
  ];

  return (
    <main className="min-h-screen bg-void text-white p-6 md:p-12 relative overflow-hidden">
      {/* BG DECORATION */}
      <div className="absolute top-0 right-0 font-shout text-[300px] text-white/[0.01] leading-none select-none pointer-events-none -translate-y-1/4">CMD</div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-armor-light pb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-blood" />
              <span className="font-tech text-blood text-[10px] tracking-[0.3em] uppercase font-bold">Panel de Control</span>
            </div>
            <h1 className="font-shout text-4xl md:text-6xl uppercase leading-none">Puesto de Mando</h1>
            <p className="font-tech text-gray-500 text-xs mt-3 uppercase tracking-wider">
              Oficial al Mando: <span className="text-white font-bold">{profile?.nickname}</span>
              <span className="text-blood mx-2">·</span>
              <span className={`${profile?.role === 'ROOT' ? 'text-blood' : 'text-blue-400'}`}>{profile?.role}</span>
            </p>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/comando"); }}
            className="flex items-center gap-2 font-tech text-xs text-steel hover:text-blood transition-colors mt-4 md:mt-0 group"
          >
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
            Cerrar Sesión
          </button>
        </motion.div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: Users, label: "Efectivos", value: stats.users, color: "text-blue-400" },
            { icon: FileText, label: "Publicaciones", value: stats.posts, color: "text-green-400" },
            { icon: ShoppingBag, label: "Productos", value: stats.products, color: "text-yellow-400" },
          ].map((s, i) => (
            <div key={i} className="border border-armor-light bg-paper-dark/50 p-4 md:p-5 flex items-center gap-4">
              <s.icon size={20} className={s.color} />
              <div>
                <p className="font-shout text-2xl md:text-3xl text-white leading-none">{s.value}</p>
                <p className="font-tech text-[9px] text-steel uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* COMMAND CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {commandCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
            >
              <Link href={card.href} className="group relative block border border-armor-light bg-paper-dark/30 hover:border-blood/50 transition-all duration-500 p-8 min-h-[220px] flex flex-col justify-between overflow-hidden glow-red-hover">
                {/* CORNER ACCENT */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blood/30 group-hover:border-blood transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blood/30 group-hover:border-blood transition-colors"></div>

                {/* ICON */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <card.icon size={60} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <card.icon size={16} className="text-blood" />
                    <span className="font-tech text-[8px] text-steel uppercase tracking-[0.2em]">{card.statLabel}: {card.stat}</span>
                  </div>
                  <h3 className="font-heavy text-2xl text-white uppercase group-hover:text-blood transition-colors">{card.title}</h3>
                  <p className="font-tech text-[10px] text-gray-500 mt-2 uppercase tracking-tight">{card.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 font-tech text-xs text-blood mt-4 group-hover:gap-3 transition-all">
                  ACCEDER <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* EDITORIAL CONTROL CENTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-armor-light pt-12"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-1 w-12 bg-blood"></div>
            <h2 className="font-shout text-3xl uppercase text-white">Centro de Control Editorial</h2>
          </div>
          <ArticleManager />
        </motion.div>

      </div>
    </main>
  );
}
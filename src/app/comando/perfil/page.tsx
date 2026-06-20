"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Shield, MapPin, Calendar, Fingerprint, Activity } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/comando"); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <Activity className="mx-auto text-blood mb-4 animate-pulse" size={36} />
        <p className="font-tech text-blood text-xs tracking-[0.3em] uppercase animate-pulse">Cargando Expediente...</p>
      </div>
    </div>
  );

  const roleConfig: Record<string, { color: string; label: string }> = {
    ROOT: { color: 'border-blood text-blood bg-blood/10', label: 'RAÍZ DEL SISTEMA' },
    COMANDO: { color: 'border-blue-500 text-blue-400 bg-blue-500/10', label: 'OFICIAL DE MANDO' },
    AFILIADO: { color: 'border-armor-light text-steel bg-armor/20', label: 'MIEMBRO ACTIVO' },
  };

  const role = roleConfig[profile?.role] || roleConfig.AFILIADO;

  return (
    <main className="min-h-screen bg-void text-white p-4 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood/5 rounded-full blur-[150px]"></div>
        <div className="absolute top-10 left-10 font-shout text-[200px] text-white/[0.01] leading-none select-none">UNC</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-shout text-3xl uppercase">Expediente Digital</h1>
          <p className="font-tech text-steel text-[10px] tracking-[0.3em] uppercase mt-2">Identificación Oficial del Movimiento</p>
        </div>

        {/* THE ID CARD */}
        <motion.div
          initial={{ rotateX: 10 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gradient-to-br from-paper-dark to-void border border-armor-light overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group hover:border-blood/50 transition-all duration-500"
        >
          {/* TOP BAR */}
          <div className="h-1 bg-gradient-to-r from-transparent via-blood to-transparent"></div>

          <div className="bg-armor/30 p-4 flex justify-between items-center border-b border-armor-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blood flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <span className="font-heavy text-sm tracking-widest text-white">UNC // ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-tech text-[9px] text-green-400 uppercase tracking-widest">Activo</span>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 relative">
            <div className="flex gap-6 items-start">
              {/* PHOTO PLACEHOLDER */}
              <div className="w-24 h-32 bg-armor/50 border border-armor-light flex items-center justify-center shrink-0 relative overflow-hidden">
                <Fingerprint size={32} className="text-armor-light" />
                {/* SCAN EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blood/10 to-transparent animate-pulse"></div>
              </div>

              {/* DATA */}
              <div className="space-y-5 w-full">
                <div>
                  <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1">Nombre Clave</p>
                  <h2 className="font-shout text-2xl text-white uppercase leading-none">{profile?.nickname}</h2>
                </div>

                <div>
                  <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1">Rango</p>
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase border tracking-wider ${role.color}`}>
                    {profile?.role}
                  </span>
                  <p className="font-tech text-[8px] text-gray-600 mt-1">{role.label}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                      <MapPin size={8} /> Ubicación
                    </p>
                    <p className="font-tech text-xs text-white uppercase">{profile?.city}</p>
                  </div>
                  <div>
                    <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                      <Calendar size={8} /> Ingreso
                    </p>
                    <p className="font-tech text-xs text-white">
                      {new Date(profile?.created_at).toLocaleDateString().replace(/\//g, '.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="mt-6 pt-4 border-t border-armor-light flex justify-between items-end">
              <div>
                <div className="h-1.5 w-28 bg-armor/50 mb-1"></div>
                <p className="font-tech text-[7px] text-gray-600 tracking-[0.2em]">{profile?.id.split('-')[0].toUpperCase()}</p>
              </div>
              {/* QR PLACEHOLDER */}
              <div className="w-12 h-12 bg-white p-1 relative">
                <div className="w-full h-full bg-void grid grid-cols-4 grid-rows-4 gap-px">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.4 ? 'bg-white' : 'bg-void'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="font-tech text-[9px] text-gray-600 tracking-wider uppercase max-w-xs mx-auto">
            Esta credencial es personal e intransferible
          </p>

          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/comando"); }}
            className="flex items-center gap-2 mx-auto font-tech text-xs text-steel hover:text-blood transition-colors group"
          >
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
            Cerrar Sesión
          </button>
        </motion.div>

      </motion.div>
    </main>
  );
}
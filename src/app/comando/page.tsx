"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const nicknameInput = formData.get("nickname") as string;
    const password = formData.get("password") as string;

    const cleanNickname = nicknameInput.trim().replace(/\s+/g, '').toLowerCase();
    const internalEmail = `${cleanNickname}@unc-sistema.com`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    });

    if (error) {
      setErrorMsg("ACCESO DENEGADO: Credenciales inválidas.");
      setLoading(false);
      return;
    }

    if (data.user) {
      // IP Logger
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        await supabase
          .from('profiles')
          .update({ last_ip: ipData.ip, last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      } catch (err) {
        console.error("Error capturando IP:", err);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      const role = profile?.role;
      if (role === 'ROOT' || role === 'COMANDO') {
        router.push("/comando/dashboard");
      } else {
        router.push("/comando/perfil");
      }
    }
  };

  return (
    <main className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-10 left-10 font-shout text-[200px] text-white/[0.015] leading-none select-none">UNC</div>
        <div className="absolute bottom-10 right-10 font-shout text-[120px] text-white/[0.015] leading-none select-none rotate-12">SISTEMA</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="border border-armor-light bg-paper-dark/80 backdrop-blur-xl shadow-[0_0_60px_rgba(239,68,68,0.08)] overflow-hidden">

          {/* TOP ACCENT BAR */}
          <div className="h-1 bg-gradient-to-r from-transparent via-blood to-transparent"></div>

          <div className="p-8 md:p-10">
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-blood/30 bg-blood/10 flex items-center justify-center relative">
                <ShieldAlert className="text-blood" size={28} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blood animate-pulse"></div>
              </div>
              <h1 className="font-shout text-3xl text-white uppercase tracking-tight">Acceso Restringido</h1>
              <p className="font-tech text-[10px] text-blood mt-3 tracking-[0.3em] uppercase">
                Unión Nacionalista Colombiana
              </p>
            </motion.div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                  <User size={10} className="text-blood" />
                  Nickname
                </label>
                <input
                  name="nickname"
                  type="text"
                  required
                  className="w-full bg-void/50 border border-armor-light p-4 text-white font-heavy tracking-wider focus:border-blood focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] placeholder-gray-700"
                  placeholder="Ej: Nacionalista123"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block font-tech text-[10px] text-steel mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={10} className="text-blood" />
                  Clave de Acceso
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-void/50 border border-armor-light p-4 text-white font-tech text-sm focus:border-blood focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] placeholder-gray-700"
                  placeholder="••••••••••"
                />
              </motion.div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blood/10 border border-blood/30 p-3 text-blood font-tech text-xs text-center"
                >
                  {errorMsg}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                type="submit"
                disabled={loading}
                className="w-full bg-white text-void font-heavy uppercase py-4 hover:bg-blood hover:text-white transition-all tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 glow-red-hover"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    VERIFICANDO...
                  </>
                ) : (
                  "ENTRAR AL SISTEMA"
                )}
              </motion.button>
            </form>

            {/* FOOTER NOTE */}
            <div className="mt-8 text-center">
              <p className="font-tech text-[9px] text-gray-600 tracking-wider">
                SISTEMA PROTEGIDO · ACCESO SOLO A PERSONAL AUTORIZADO
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
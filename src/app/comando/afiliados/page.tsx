"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Search, Shield, LogOut, ChevronDown } from "lucide-react";

type Profile = {
  id: string;
  nickname: string;
  role: "AFILIADO" | "COMANDO" | "ROOT";
  city: string;
  phone: string;
  reason: string;
  created_at: string;
  last_ip?: string;
  last_login?: string;
};

export default function GestionTropasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [myRole, setMyRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/comando"); return; }

    const { data: myProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (myProfile?.role !== 'ROOT') {
      alert("ACCESO DENEGADO: SE REQUIERE NIVEL ROOT.");
      router.push("/comando");
      return;
    }

    setMyRole(myProfile.role);

    const { data: tropa } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (tropa) setProfiles(tropa as Profile[]);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    const confirmacion = confirm(`¿Confirmas cambiar el rango de este usuario a ${newRole}?`);
    if (!confirmacion) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert("Error al actualizar rango.");
    } else {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    ROOT: 'border-blood text-blood bg-blood/10',
    COMANDO: 'border-blue-500 text-blue-400 bg-blue-500/10',
    AFILIADO: 'border-armor-light text-steel bg-armor/20',
  };

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <Users className="mx-auto text-blood mb-4 animate-pulse" size={36} />
        <p className="font-tech text-blood text-xs tracking-[0.3em] uppercase animate-pulse">Verificando Credenciales...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-void text-white p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/comando/dashboard" className="inline-flex items-center gap-2 font-tech text-[10px] text-steel hover:text-white transition-colors uppercase tracking-widest mb-4 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Comando
          </Link>
          <div className="border-b border-armor-light pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-blood rounded-full animate-pulse"></span>
                <span className="font-tech text-blood text-[10px] tracking-[0.3em] uppercase font-bold">Administración Institucional</span>
              </div>
              <h1 className="font-shout text-3xl md:text-5xl uppercase leading-none">Gestión de Miembros</h1>
            </div>
            <div className="text-right flex flex-col md:items-end gap-2">
              <span className="font-tech text-steel text-xs uppercase">Miembros Registrados: <span className="text-white font-bold">{profiles.length}</span></span>
              <button
                onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
                className="flex items-center gap-2 font-tech text-xs text-steel hover:text-blood transition-colors group"
              >
                <LogOut size={12} className="group-hover:translate-x-0.5 transition-transform" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
          <input
            type="text"
            placeholder="Buscar por usuario o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-paper-dark/50 border border-armor-light pl-12 pr-4 py-3 text-white font-tech text-sm focus:border-blood outline-none transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.05)] placeholder-gray-600"
          />
        </div>

        {/* TABLE */}
        <div className="border border-armor-light bg-paper-dark/30 overflow-x-auto shadow-2xl">
          <table className="w-full text-left font-tech text-sm">
            <thead className="bg-armor/50 text-steel uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol / Nivel</th>
                <th className="p-4">Ubicación</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Motivación</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-armor/50">
              {filteredProfiles.map((miembro, index) => (
                <motion.tr
                  key={miembro.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`hover:bg-void/50 transition-colors group ${miembro.role === 'ROOT' ? 'border-l-2 border-l-blood' :
                      miembro.role === 'COMANDO' ? 'border-l-2 border-l-blue-500' : ''
                    }`}
                >
                  <td className="p-4">
                    <span className="font-bold text-white text-base block">{miembro.nickname}</span>
                    <span className="text-[9px] text-gray-500 font-normal">{new Date(miembro.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-[9px] font-bold border uppercase tracking-wider ${roleColors[miembro.role] || roleColors.AFILIADO}`}>
                      {miembro.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 uppercase text-xs">{miembro.city}</td>
                  <td className="p-4 text-steel text-xs">{miembro.phone}</td>
                  <td className="p-4 max-w-xs">
                    <div className="truncate text-gray-500 italic text-[11px]" title={miembro.reason}>
                      &ldquo;{miembro.reason}&rdquo;
                    </div>
                  </td>
                  <td className="p-4">
                    {miembro.role !== 'ROOT' ? (
                      <div className="relative">
                        <select
                          className="appearance-none bg-void/50 border border-armor-light text-xs p-2 pr-8 focus:border-blood outline-none cursor-pointer hover:border-blood/50 transition-colors text-white"
                          value={miembro.role}
                          onChange={(e) => updateRole(miembro.id, e.target.value)}
                        >
                          <option value="AFILIADO">AFILIADO</option>
                          <option value="COMANDO">COMANDO</option>
                          <option value="ROOT">ROOT</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-steel pointer-events-none" />
                      </div>
                    ) : (
                      <span className="font-tech text-[9px] text-gray-600 flex items-center gap-1">
                        <Shield size={10} /> PROTEGIDO
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, MapPin, Phone, Shield, LogOut, Edit3, ChevronRight, Send } from 'lucide-react';
import ProfileEditForm from '@/components/ProfileEditForm';

export default function MiCuentaPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center text-white font-tech uppercase tracking-widest text-xs">
      Cargando Datos de Miembro...
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-void text-white">
      <Navbar />
      
      {/* Modal de Edición */}
      {isEditing && (
        <ProfileEditForm 
          profile={profile} 
          onUpdate={(newProfile) => setProfile(newProfile)} 
          onClose={() => setIsEditing(false)} 
        />
      )}

      <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light bg-void">
        
        {/* Header del Perfil */}
        <section className="p-6 md:p-16 border-b border-armor-light relative overflow-hidden bg-armor/5">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User size={200} className="text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-armor/20 border-2 border-blood flex items-center justify-center">
                <User size={60} className="text-white opacity-50" />
              </div>
              <div className="space-y-2">
                <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase block">Perfil de Afiliado</span>
                <h1 className="font-heavy text-4xl md:text-6xl text-white uppercase">{profile?.nickname}</h1>
                <div className="flex items-center gap-2 font-tech text-xs text-steel uppercase">
                  <Shield size={12} className="text-blood" />
                  <span>Rango: {profile?.role || 'AFILIADO'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-armor/20 border border-armor-light px-6 py-3 font-heavy text-[10px] uppercase tracking-widest hover:bg-armor transition-all"
              >
                <Edit3 size={14} />
                <span>Editar Perfil</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-blood/10 border border-blood px-6 py-3 font-heavy text-[10px] uppercase tracking-widest hover:bg-blood transition-all"
              >
                <LogOut size={14} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </section>

        {/* Grid de Información */}
        <section className="p-6 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tarjeta: Datos de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-armor-light bg-paper-dark p-8">
              <h3 className="font-heavy text-lg uppercase mb-8 border-b border-armor-light pb-4">Información Base</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-armor/20 flex items-center justify-center">
                    <MapPin size={18} className="text-blood" />
                  </div>
                  <div>
                    <span className="block font-tech text-[9px] text-steel uppercase">Ciudad de Residencia</span>
                    <span className="font-body text-sm text-white">{profile?.city || 'No registrada'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-armor/20 flex items-center justify-center">
                    <Phone size={18} className="text-blood" />
                  </div>
                  <div>
                    <span className="block font-tech text-[9px] text-steel uppercase">Número de Contacto</span>
                    <span className="font-body text-sm text-white">{profile?.phone || 'No registrado'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta: Actividad & Estado */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-t border-armor-light pt-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-heavy text-lg uppercase">Estado Institucional</h3>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 font-tech text-[9px] uppercase tracking-widest animate-pulse">
                  MIEMBRO ACTIVO
                </span>
              </div>
              <p className="font-body text-gray-400 text-sm leading-relaxed mb-8">
                Usted se encuentra registrado bajo la circunscripción institucional de <strong>{profile?.city}</strong>. 
                Recuerde que su nickname es su identidad única dentro de la plataforma. Para cualquier ajuste en su rango o permisos, contacte con su coordinación regional a través de los canales internos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-armor/10 border border-armor-light p-6">
                  <span className="block font-tech text-[9px] text-steel uppercase mb-2">Fecha de Ingreso</span>
                  <span className="font-heavy text-xl uppercase">{new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
                <div className="bg-armor/10 border border-armor-light p-6">
                  <span className="block font-tech text-[9px] text-steel uppercase mb-2">Artículos Publicados</span>
                  <span className="font-heavy text-xl uppercase">0</span>
                </div>
              </div>

              {/* COMUNICACIONES INTERNAS (CHAT) */}
              <div className="bg-armor/5 border border-armor-light p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                  <Send size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h4 className="font-heavy text-xl uppercase text-white">Comunicaciones Internas</h4>
                  </div>
                  <p className="font-body text-gray-400 text-sm mb-6 max-w-lg">
                    Acceda al canal de comunicación en tiempo real. Participe en las discusiones de su división y manténgase informado sobre las directrices institucionales.
                  </p>
                  <Link 
                    href="/chat"
                    className="inline-flex items-center gap-3 bg-blood text-white px-8 py-4 font-heavy text-xs uppercase tracking-widest hover:bg-white hover:text-void transition-all group/btn"
                  >
                    <span>Entrar al Chat de la Unidad</span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* OPCIONES DE MANDO (Si aplica) */}
              {(profile?.role === 'ROOT' || profile?.role === 'COMANDO') && (
                <div className="bg-blood/5 border border-blood/30 p-8 glow-red">
                   <div className="flex items-center gap-3 mb-4">
                      <Shield size={20} className="text-blood" />
                      <h4 className="font-heavy text-xl uppercase text-white">Panel de Mando Disponible</h4>
                   </div>
                   <p className="font-body text-gray-400 text-sm mb-6">
                     Sus credenciales le otorgan acceso a los sistemas de administración, redacción y gestión institucional.
                   </p>
                   <Link 
                    href="/comando/dashboard"
                    className="inline-flex items-center gap-3 bg-white text-void px-8 py-4 font-heavy text-xs uppercase tracking-widest hover:bg-blood hover:text-white transition-all group"
                   >
                     Entrar al Sistema de Mando
                     <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              )}
            </div>
          </div>

        </section>

      </div>

      <Footer />
    </main>
  );
}

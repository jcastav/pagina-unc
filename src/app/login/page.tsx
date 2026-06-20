'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'error' | 'invalid_creds'>('idle');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const nickname = formData.get('nickname') as string;
    const password = formData.get('password') as string;

    // EL MISMO TRUCO DE REGISTRO: Convertimos nickname a fake email
    const cleanEmailUser = nickname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const fakeEmail = `${cleanEmailUser}@unc-sistema.com`;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setStatus('invalid_creds');
        } else {
          setStatus('error');
        }
        return;
      }

      window.location.href = '/perfil';

    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-void text-white">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-6 bg-paper-dark relative overflow-hidden">
        {/* Decoración de fondo sobria */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <h2 className="font-shout text-[15vw] leading-none uppercase select-none translate-x-[-10%] translate-y-[-10%]">
            ACCESO
          </h2>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="border border-armor-light bg-void p-8 md:p-12 shadow-2xl">
            <div className="mb-10 text-center">
              <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase block mb-4">Portal de Miembros</span>
              <h1 className="font-heavy text-3xl text-white uppercase tracking-tighter">Identificación</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block font-tech text-[10px] text-steel uppercase tracking-widest mb-2">Nombre de Usuario</label>
                <input 
                  required
                  name="nickname"
                  type="text"
                  className="w-full bg-armor/10 border border-armor-light p-4 text-white font-heavy text-sm focus:border-blood focus:outline-none transition-all"
                  placeholder="Usuario_26"
                />
              </div>

              <div>
                <label className="block font-tech text-[10px] text-steel uppercase tracking-widest mb-2">Contraseña</label>
                <input 
                  required
                  name="password"
                  type="password"
                  className="w-full bg-armor/10 border border-armor-light p-4 text-white font-tech text-sm focus:border-blood focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-white text-void py-5 font-heavy text-sm uppercase tracking-widest hover:bg-blood hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? 'AUTENTICANDO...' : 'ENTRAR AL SISTEMA'}
              </button>

              {status === 'invalid_creds' && (
                <p className="text-red-500 font-tech text-[10px] text-center uppercase tracking-widest mt-4">
                  ERROR: Credenciales no válidas.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 font-tech text-[10px] text-center uppercase tracking-widest mt-4">
                  ERROR: No se pudo conectar con el servidor.
                </p>
              )}
            </form>

            <div className="mt-12 pt-8 border-t border-armor-light text-center">
              <p className="font-tech text-steel text-[10px] uppercase mb-4">¿Aún no eres miembro?</p>
              <a href="/afiliarse" className="font-heavy text-xs text-white hover:text-blood transition-colors uppercase tracking-widest underline underline-offset-8">
                Iniciar Proceso de Afiliación
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

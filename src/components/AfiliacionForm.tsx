"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AfiliacionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "nickname_taken">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    
    // Capturamos los datos que el usuario VE
    const nickname = formData.get("nickname") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const reason = formData.get("reason") as string;

    // TRUCO TÉCNICO:
    // Creamos un "Fake Email" interno para que Supabase funcione sin pedir email real.
    // El usuario nunca sabrá esto. Solo usa su nickname.
    const cleanEmailUser = nickname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const fakeEmail = `${cleanEmailUser}@unc-sistema.com`;

    try {
      // 1. Intentamos crear el usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
        options: {
          data: {
            nickname: nickname, // <--- Aquí va el original con tildes y Mayúsculas
            phone: phone,
            city: city,
            reason: reason,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setStatus("success");
        // Opcional: router.push("/mi-cuenta"); 
      }

    } catch (error: any) {
      console.error("Error registro:", error);
      if (error.message.includes("already registered")) {
        setStatus("nickname_taken");
      } else {
        setStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      
      <div className="bg-armor/50 p-4 border-l-4 border-blood mb-6">
        <p className="font-tech text-xs text-gray-300">
          <strong className="text-white">PROTOCOLO DE ANONIMATO:</strong> NO REQUERIMOS TU NOMBRE REAL NI CORREO. 
          CREA UN ALIAS (NICKNAME) ÚNICO.
        </p>
      </div>

      <div className="space-y-4">
        {/* NICKNAME LIBERADO */}
        <div>
          <label className="block font-tech text-xs text-steel mb-1 uppercase">Alias / Nickname (Tu Identidad)</label>
          <input 
            required 
            name="nickname" 
            type="text" 
            // CAMBIO: Quité 'uppercase'. Ahora permite escribir libremente.
            className="w-full bg-void border border-armor p-3 text-white font-heavy tracking-widest text-sm focus:border-blood focus:outline-none transition-colors" 
            placeholder="Ej: Agente_01" 
          />
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className="block font-tech text-xs text-steel mb-1 uppercase">Contraseña de Acceso</label>
          <input 
            required 
            name="password" 
            type="password" 
            minLength={6}
            className="w-full bg-void border border-armor p-3 text-white font-tech text-sm focus:border-blood focus:outline-none transition-colors" 
            placeholder="••••••••" 
          />
          <span className="text-[10px] text-gray-600 font-tech">Mínimo 6 caracteres. No la olvides.</span>
        </div>

        {/* DATOS OBLIGATORIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block font-tech text-xs text-steel mb-1 uppercase">Ciudad Base</label>
            <input required name="city" type="text" className="w-full bg-void border border-armor p-3 text-white font-body text-sm focus:border-blood focus:outline-none transition-colors" placeholder="Ej: Bogotá" />
            </div>
            <div>
            <label className="block font-tech text-xs text-steel mb-1 uppercase">Número</label>
            <input required name="phone" type="tel" className="w-full bg-void border border-armor p-3 text-white font-body text-sm focus:border-blood focus:outline-none transition-colors" placeholder="+57 ..." />
            </div>
        </div>

        <div>
          <label className="block font-tech text-xs text-steel mb-1 uppercase">Motivo de Ingreso</label>
          <textarea name="reason" rows={2} className="w-full bg-void border border-armor p-3 text-white font-body text-sm focus:border-blood focus:outline-none transition-colors" placeholder="Breve descripción..."></textarea>
        </div>
      </div>

      {/* Botón de Envío */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-white text-black font-heavy uppercase py-4 hover:bg-blood hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
      >
        {loading ? "GENERANDO IDENTIDAD..." : "CREAR CUENTA SEGURA"}
      </button>

      {status === "success" && (
        <div className="p-4 border border-green-900 bg-green-900/20 text-green-500 font-tech text-xs text-center">
            [ BIENVENIDO ] TU CUENTA HA SIDO CREADA. YA ERES PARTE DE LA RED.
        </div>
      )}
      {status === "nickname_taken" && (
        <div className="p-4 border border-yellow-900 bg-yellow-900/20 text-yellow-500 font-tech text-xs text-center">
            [ ERROR ] ESE ALIAS YA ESTÁ EN USO. ELIGE OTRO.
        </div>
      )}
      {status === "error" && (
        <div className="p-4 border border-red-900 bg-red-900/20 text-red-500 font-tech text-xs text-center">
            [ FALLO CRÍTICO ] ERROR EN EL NODO DE REGISTRO. INTENTA DE NUEVO.
        </div>
      )}

    </form>
  );
}
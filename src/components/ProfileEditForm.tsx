'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ProfileEditFormProps {
  profile: any;
  onUpdate: (newProfile: any) => void;
  onClose: () => void;
}

export default function ProfileEditForm({ profile, onUpdate, onClose }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const city = formData.get('city') as string;
    const phone = formData.get('phone') as string;

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ city, phone })
      .eq('id', profile.id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      onUpdate(data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-void/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md border border-armor-light bg-void p-8 shadow-2xl">
        <h3 className="font-shout text-2xl text-white uppercase mb-8">Actualizar Perfil</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-tech text-[10px] text-steel uppercase tracking-widest mb-2">Ciudad Base</label>
            <input 
              required
              name="city"
              defaultValue={profile.city}
              type="text"
              className="w-full bg-armor/10 border border-armor-light p-4 text-white font-body text-sm focus:border-blood focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-tech text-[10px] text-steel uppercase tracking-widest mb-2">Número de Contacto</label>
            <input 
              required
              name="phone"
              defaultValue={profile.phone}
              type="text"
              className="w-full bg-armor/10 border border-armor-light p-4 text-white font-body text-sm focus:border-blood focus:outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 font-tech text-[10px] uppercase">{error}</p>}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="py-4 border border-armor-light font-heavy text-[10px] uppercase tracking-widest hover:bg-armor transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="py-4 bg-white text-void font-heavy text-[10px] uppercase tracking-widest hover:bg-blood hover:text-white transition-all disabled:opacity-50"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

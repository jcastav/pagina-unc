import Link from "next/link";
import {
  Activity, ShieldCheck, Instagram, Facebook, Twitter,
  Youtube, Send, AtSign, Music2
} from "lucide-react";

export default function Footer() {
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
            Portal oficial de la Unión Nacionalista de Colombia. Impulsando el orden, la soberanía y la renovación nacional a través de la formación y la acción logística.
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
            <li><Link href="/tienda" className="font-heavy text-xs uppercase text-steel hover:text-white transition-colors">Logística (Tienda)</Link></li>
          </ul>
        </div>

        {/* STATUS COLUMN */}
        <div className="md:col-span-4 bg-armor/10 border border-armor-light p-6">
          <h5 className="font-tech text-xs text-white uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
            <Activity size={14} className="text-blood animate-pulse" />
            Estado del Sistema
          </h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-tech border-b border-armor-light/50 pb-2">
              <span className="text-steel uppercase">Red de Datos:</span>
              <span className="text-green-500">EN LÍNEA</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-tech border-b border-armor-light/50 pb-2">
              <span className="text-steel uppercase">Nivel de Seguridad:</span>
              <span className="text-blood">PROTOCOLO IV</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-tech border-b border-armor-light/50 pb-2">
              <span className="text-steel uppercase">Servidor:</span>
              <span className="text-white">CO-CENTRAL-01</span>
            </div>
          </div>
          <Link href="/comando" className="inline-block mt-6 font-tech text-[10px] text-blood border border-blood bg-blood/5 px-4 py-2 hover:bg-blood hover:text-white transition-all uppercase tracking-[0.2em] w-full text-center">
            [ ACCESO RESTRINGIDO ]
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-armor-light flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-tech text-[9px] text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} UNC | UNION NACIONALISTA COLOMBIANA - SECTOR LOGÍSTICO V.2.0
        </p>
        <div className="flex gap-6">
          <span className="font-tech text-[9px] text-armor uppercase">Privacidad</span>
          <span className="font-tech text-[9px] text-armor uppercase">Terminos de Servicio</span>
        </div>
      </div>
    </footer>
  );
}
import { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import InstitutionalSection from "@/components/InstitutionalSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import TerritorialMap from "@/components/TerritorialMap";

export const metadata: Metadata = {
  title: "Sobre Nosotros | UNC Institucional",
  description: "Conoce el origen, los principios y la labor de la Unión Nacionalista Colombiana como centro de pensamiento, comunidad ideológica y medio digital.",
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen flex flex-col bg-void text-white">
      <Navbar />

      {/* Contenedor central con bordes estéticos consistentes con la Home */}
      <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor-light bg-void">

        <AboutHero />

        {/* Sección: Nuestra Naturaleza */}
        <section className="p-6 md:p-16 border-b border-armor-light overflow-hidden relative">
          {/* Decoración de fondo */}
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blood/5 blur-[120px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="font-heavy text-3xl md:text-5xl uppercase text-white leading-tight">
                Vanguardia <br /> intelectual y <br /> fuerza ciudadana
              </h2>
              <p className="font-body text-gray-400 text-lg leading-relaxed">
                Fundada el 1 de enero de 2026, la Unión Nacionalista Colombiana (UNC) es el resultado de la unificación de diversas corrientes patrióticas.
                Nuestra misión es adaptar los modelos corporativistas y de tercera posición a la realidad histórica y social de Colombia.
              </p>
              <div className="bg-armor/20 p-6 border-l-4 border-blood">
                <p className="font-tech text-xs text-white italic uppercase tracking-wider">
                  "Reflejamos el intento de adaptar el modelo corporativista y la tradición católica a la realidad política contemporánea."
                </p>
              </div>
            </div>

            {/* Grid de Pilares Doctrinarios (Client Component) */}
            <PrinciplesSection />
          </div>
        </section>

        <InstitutionalSection />
        
        <TerritorialMap />

        {/* Sección: Llamado Institucional */}
        <section className="py-24 px-6 md:px-16 text-center bg-void relative scanline border-t border-armor-light">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase block mb-4">Afiliación</span>
            <h2 className="font-shout text-4xl md:text-6xl text-white uppercase mb-8">
              Sé parte de la <br /> estructura nacional
            </h2>
            <p className="text-gray-500 font-body mb-10 leading-relaxed text-sm uppercase tracking-tight">
              Invitamos a profesionales, académicos y ciudadanos comprometidos a sumarse a nuestra comunidad de pensamiento y acción ciudadana.
            </p>

            <a
              href="https://t.me/nacionalismoUNC"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center bg-white text-void px-12 py-5 font-heavy text-sm uppercase tracking-widest hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Unirse a Telegram</span>
              <div className="absolute inset-0 bg-blood translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            </a>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}

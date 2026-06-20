'use client';

import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 border-b border-armor-light overflow-hidden bg-void">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <h2 className="font-shout text-[15vw] leading-none uppercase select-none translate-x-[-5%] translate-y-[-10%]">
          INSTITUCIÓN
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-tech text-blood text-xs tracking-[0.4em] uppercase font-bold block mb-6">
            Tradición & Vanguardia · Est. 2026
          </span>
          <h1 className="font-shout text-5xl md:text-8xl text-white uppercase leading-none mb-8">
            Unión Nacionalista <br /> <span className="text-blood">Colombiana</span>
          </h1>
          <p className="font-body text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Herederos del legado intelectual de los Leopardos y el Alzatismo. 
            Una plataforma de pensamiento dedicada a la restauración de la identidad 
            hispánica y el orden corporativo en nuestra Nación.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

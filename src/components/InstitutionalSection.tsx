'use client';

import { motion } from 'framer-motion';
import { Newspaper, GraduationCap, Users } from 'lucide-react';

export default function InstitutionalSection() {
  const activities = [
    {
      title: "Medio de Análisis",
      description: "Proveemos información analítica y opinión fundamentada sobre la actualidad nacional, fomentando un debate ciudadano serio y basado en principios.",
      icon: Newspaper,
      color: "text-blue-400"
    },
    {
      title: "Centro de Formación",
      description: "Desarrollamos programas de formación doctrinal e intelectual, permitiendo a nuestros afiliados profundizar en los pilares fundamentales del pensamiento nacionalista.",
      icon: GraduationCap,
      color: "text-green-400"
    },
    {
      title: "Comunidad Organizada",
      description: "Generamos espacios de encuentro, círculos de debate y participación ciudadana estructurada para fortalecer el tejido social y la representatividad nacional.",
      icon: Users,
      color: "text-yellow-400"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-void relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 border-l-4 border-blood pl-6">
          <h2 className="font-shout text-4xl md:text-6xl text-white uppercase">Nuestro Alcance</h2>
          <p className="font-tech text-gray-500 text-sm mt-4 uppercase tracking-widest">Dimensiones de nuestra labor institucional</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {activities.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="space-y-6"
            >
              <item.icon size={40} className={item.color} />
              <h3 className="font-heavy text-2xl text-white uppercase">{item.title}</h3>
              <p className="font-body text-gray-400 leading-relaxed border-t border-armor-light pt-6">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

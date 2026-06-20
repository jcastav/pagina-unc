'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Shield, Layers, Globe } from 'lucide-react';

export default function TerritorialMap() {
    return (
        <section className="py-24 px-6 md:px-16 border-b border-armor-light bg-paper-dark/20 relative overflow-hidden">
            {/* DECORATIVE ELEMENTS */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 border border-white rotate-45"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 border border-white -rotate-12"></div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                
                {/* TEXT CONTENT */}
                <div className="lg:w-1/2 space-y-8">
                    <div>
                        <span className="font-tech text-blood text-[10px] tracking-[0.5em] uppercase font-bold block mb-4">Despliegue Institucional</span>
                        <h2 className="font-shout text-4xl md:text-6xl text-white uppercase leading-none mb-6">
                            Estructura <br /> Territorial
                        </h2>
                    </div>

                    <p className="font-body text-gray-400 text-lg leading-relaxed">
                        Nuestra presencia nacional se organiza a través de un sistema de <span className="text-white font-bold">ocho divisiones gubernamentales</span>. 
                        Este modelo permite una gestión descentralizada pero coordinada, adaptando nuestra labor institucional a las necesidades geográficas e históricas de cada región colombiana.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: <MapPin size={18} />, title: "8 DIVISIONES", desc: "Cobertura total del territorio" },
                            { icon: <Shield size={18} />, title: "COORDINACIÓN", desc: "Gestión regional autónoma" },
                            { icon: <Layers size={18} />, title: "JERARQUÍA", desc: "Estructura de mando unificada" },
                            { icon: <Globe size={18} />, title: "PRESENCIA", desc: "Adaptación cultural regional" }
                        ].map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                key={i} 
                                className="flex items-start gap-4 p-4 border border-armor-light bg-void/50 hover:border-blood transition-colors group"
                            >
                                <div className="text-blood mt-1 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-heavy text-[11px] text-white uppercase tracking-widest mb-1">{item.title}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-tech">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* MAP IMAGE CONTAINER */}
                <div className="lg:w-1/2 relative group">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative z-10 border border-armor-light p-2 bg-void shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image 
                                src="/images/mapa_territorial.jpg" 
                                alt="Mapa Estructura Territorial UNC" 
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                            {/* SCANLINE OVERLAY */}
                            <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                            {/* GRID OVERLAY */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    {/* DECORATIVE LABELS */}
                    <div className="absolute -top-6 -right-6 font-tech text-[10px] text-blood bg-void border border-blood px-4 py-2 rotate-12 z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        CONFIGURACIÓN TERRITORIAL V. 2026
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 border-2 border-blood/20 rounded-full animate-ping pointer-events-none"></div>
                </div>

            </div>
        </section>
    );
}

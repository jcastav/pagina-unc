'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ShieldCheck, CreditCard, Copy, Check } from 'lucide-react';

export default function DonationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const handleCopy = () => {
        // Asumiendo que hay un número o ID de cuenta que copiar
        // Si el usuario quiere, podemos añadir el número de Nequi aquí
        navigator.clipboard.writeText("Cuenta de Donaciones UNC");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* TRIGGER BUTTON - Fixed position or integrated */}
            <button
                onClick={toggleModal}
                className="flex items-center gap-2 bg-blood hover:bg-white hover:text-void text-white px-4 py-2 font-heavy text-[10px] uppercase tracking-widest transition-all glow-red-hover group"
            >
                <Heart size={14} className="group-hover:fill-current" />
                <span>Apoyar</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        {/* OVERLAY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleModal}
                            className="absolute inset-0 bg-void/95 backdrop-blur-sm"
                        />

                        {/* MODAL CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-paper-dark border border-armor-light shadow-[0_0_100px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col lg:flex-row"
                        >
                            {/* CLOSE BUTTON */}
                            <button
                                onClick={toggleModal}
                                className="absolute top-6 right-6 text-steel hover:text-white transition-colors z-30 bg-void/50 p-1"
                            >
                                <X size={24} />
                            </button>

                            {/* LEFT SIDE: TEXT & MESSAGE */}
                            <div className="lg:w-1/2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-armor-light relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Heart size={200} />
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-center">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blood/10 border border-blood/30 flex items-center justify-center">
                                            <Heart className="text-blood" size={20} />
                                        </div>
                                        <span className="font-tech text-blood text-[10px] uppercase tracking-[0.3em] font-bold">Apoyo Institucional</span>
                                    </div>

                                    <h2 className="font-shout text-4xl md:text-5xl text-white uppercase mb-6 leading-none">
                                        Financia la <br /> Renovación Nacional
                                    </h2>

                                    <p className="font-body text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                                        La Unión Nacionalista Colombiana se sostiene gracias al aporte voluntario de ciudadanos comprometidos.
                                        Tu contribución permite el despliegue territorial, la logística operativa y la independencia total de nuestra plataforma.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start gap-4 p-5 bg-void/50 border-l-2 border-blood">
                                            <ShieldCheck className="text-blood shrink-0 mt-1" size={18} />
                                            <div>
                                                <h4 className="font-heavy text-[11px] text-white uppercase tracking-widest mb-1">Transparencia Total</h4>
                                                <p className="font-body text-[11px] text-gray-500 leading-relaxed italic">
                                                    Cada peso recibido es administrado con rigor para el crecimiento de la estructura nacional.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center gap-4 p-4 bg-armor/10 border border-armor-light">
                                        <div className="flex-grow">
                                            <span className="font-tech text-[9px] text-steel uppercase block mb-1">Medio de Recepción</span>
                                            <span className="font-heavy text-white text-xs uppercase">Cuenta Oficial Nequi</span>
                                        </div>
                                        <button 
                                            onClick={handleCopy}
                                            className="px-4 py-2 border border-armor-light text-steel hover:text-blood hover:border-blood transition-all flex items-center gap-2 font-tech text-[10px] uppercase tracking-widest"
                                        >
                                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            {copied ? 'Copiado' : 'Referencia'}
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            {/* RIGHT SIDE: IMAGE / QR */}
                            <div className="lg:w-1/2 bg-void p-6 md:p-12 flex items-center justify-center relative group">
                                {/* SCANLINE EFFECT */}
                                <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-10"></div>

                                <div className="relative w-full h-[450px] lg:h-full max-h-[600px] border border-armor-light shadow-2xl p-2 bg-paper-dark/50 group-hover:border-blood transition-colors duration-500">
                                    <Image
                                        src="/images/donaciones_full.jpg"
                                        alt="QR Donaciones UNC Nequi"
                                        fill
                                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    {/* <div className="absolute top-4 right-4 z-20">
                                        <span className="font-tech text-[8px] bg-blood text-white px-2 py-1 uppercase tracking-widest animate-pulse">SISTEMA ACTIVO</span>
                                    </div> */}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

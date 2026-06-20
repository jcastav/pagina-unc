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
                            className="relative w-full max-w-4xl max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-hidden bg-paper-dark border border-armor-light shadow-[0_0_100px_rgba(239,68,68,0.2)] flex flex-col lg:flex-row custom-scrollbar"
                        >
                            {/* CLOSE BUTTON */}
                            <button 
                                onClick={toggleModal}
                                className="absolute top-4 right-4 lg:top-6 lg:right-6 text-steel hover:text-white transition-colors z-50 bg-void/80 backdrop-blur-sm p-2 border border-armor-light"
                            >
                                <X size={20} />
                            </button>

                            {/* LEFT SIDE: TEXT & MESSAGE */}
                            <div className="lg:w-1/2 p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-armor-light relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Heart size={200} />
                                </div>
                                
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blood/10 border border-blood/30 flex items-center justify-center">
                                            <Heart className="text-blood" size={20} />
                                        </div>
                                        <span className="font-tech text-blood text-[10px] uppercase tracking-[0.3em] font-bold">Apoyo Institucional</span>
                                    </div>

                                    <h2 className="font-shout text-4xl md:text-5xl text-white uppercase leading-none">
                                        Financia la <br /> Renovación Nacional
                                    </h2>

                                    <p className="font-body text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                                        La Unión Nacionalista Colombiana se sostiene gracias al aporte voluntario de ciudadanos comprometidos. 
                                        Tu contribución permite el despliegue territorial y la logística operativa.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-5 bg-void/50 border-l-2 border-blood">
                                            <ShieldCheck className="text-blood shrink-0 mt-1" size={18} />
                                            <div>
                                                <h4 className="font-heavy text-[11px] text-white uppercase tracking-widest mb-1">Transparencia</h4>
                                                <p className="font-body text-[10px] text-gray-500 leading-relaxed italic">
                                                    Administración rigurosa para el crecimiento de la estructura nacional.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: IMAGE / QR */}
                            <div className="lg:w-1/2 bg-void p-4 md:p-12 flex items-center justify-center relative group">
                                {/* SCANLINE EFFECT */}
                                <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-10"></div>
                                
                                <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px] border border-armor-light shadow-2xl p-2 bg-paper-dark/50 group-hover:border-blood transition-colors duration-500">
                                    {/* MOBILE QR ONLY */}
                                    <div className="lg:hidden relative w-full h-full">
                                        <Image 
                                            src="/images/qr_nequi.jpg" 
                                            alt="Código QR Nequi Simplificado" 
                                            fill
                                            className="object-contain p-2"
                                            priority
                                        />
                                    </div>
                                    
                                    {/* DESKTOP FULL IMAGE */}
                                    <div className="hidden lg:block relative w-full h-full">
                                        <Image 
                                            src="/images/donaciones_full.jpg" 
                                            alt="QR Donaciones UNC Nequi Full" 
                                            fill
                                            className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                            priority
                                        />
                                    </div>
                                    
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                         <span className="font-tech text-[8px] text-blood bg-void/80 border border-blood/20 px-4 py-1 uppercase tracking-widest">Escanear para donar</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Package, ShieldAlert } from "lucide-react";

const WHATSAPP_NUMBER = '573000000000';

interface SupplyStoreProps {
    products: any[];
}

export default function SupplyStore({ products }: SupplyStoreProps) {

    if (!products || products.length === 0) {
        return (
            <section className="py-20 px-6 border-b-2 border-armor-light bg-void text-center scanline">
                <ShieldAlert className="mx-auto text-armor mb-6" size={48} />
                <h3 className="font-heavy text-3xl text-steel uppercase mb-3 tracking-widest">Suministros Agotados</h3>
                <p className="font-tech text-xs text-gray-600 max-w-sm mx-auto uppercase tracking-tighter">[ EL REABASTECIMIENTO ESTÁ EN CURSO. POR FAVOR, REGRESE MÁS TARDE ]</p>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 md:px-16 border-b-2 border-armor-light bg-paper-dark/30 relative">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-armor-light pb-8 gap-6">
                <div className="max-w-xl">
                    <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">Logística y Equipo</span>
                    <h2 className="font-heavy text-4xl md:text-6xl text-white uppercase leading-none mb-4">
                        Intendencia
                    </h2>
                    <p className="font-body text-gray-400 text-sm leading-relaxed">
                        Accede al equipamiento oficial del movimiento. Cada adquisición contribuye directamente al financiamiento de nuestras actividades y logística operativa.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-armor/30 p-4 border border-armor-light">
                    <div className="w-10 h-10 bg-blood flex items-center justify-center glow-red">
                        <Package className="text-white" size={20} />
                    </div>
                    <div className="font-tech">
                        <span className="text-white text-[10px] block font-bold">ESTADO DE ALMACÉN</span>
                        <span className="text-green-500 text-[9px] block">OPERATIVO // ENVÍOS DISPONIBLES</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => {
                    const hasStock = product.stock > 0;
                    const message = `Hola, quiero adquirir el ítem: ${product.name} (Precio: $${product.price})`;
                    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

                    return (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            key={product.id}
                            className={`group relative flex flex-col bg-void border border-armor-light transition-all duration-500 hover:border-blood glow-red-hover ${!hasStock && 'opacity-60 grayscale'}`}
                        >
                            {/* PRODUCT IMAGE */}
                            <div className="relative h-72 w-full overflow-hidden border-b border-armor-light">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-armor text-armor-light font-heavy text-4xl">UNC</div>
                                )}

                                {/* Price Badge */}
                                <div className="absolute top-4 right-4 bg-white text-void font-heavy text-xs px-4 py-2 shadow-xl skew-x-[-10deg]">
                                    ${product.price.toLocaleString('es-CO')}
                                </div>

                                {/* Stock Status Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <span className={`font-tech text-[8px] px-2 py-1 uppercase tracking-widest font-bold ${hasStock ? 'bg-green-500 text-white' : 'bg-blood text-white'}`}>
                                        {hasStock ? 'Stock: Disponible' : 'Agotado'}
                                    </span>
                                </div>

                                {/* AGOTADO OVERLAY */}
                                {!hasStock && (
                                    <div className="absolute inset-0 bg-void/80 flex items-center justify-center p-6 border-4 border-blood/20 m-2">
                                        <div className="text-center">
                                            <span className="block border-2 border-blood text-blood font-heavy text-2xl px-4 py-2 rotate-[-5deg] uppercase tracking-tighter">
                                                FUERA DE SERVICIO
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="p-6 flex flex-col flex-grow relative">
                                <h3 className="font-heavy text-lg md:text-xl text-white uppercase mb-3 leading-tight group-hover:text-blood transition-colors">
                                    {product.name}
                                </h3>

                                <p className="font-body text-xs text-gray-500 mb-6 line-clamp-2 flex-grow leading-relaxed">
                                    {product.description}
                                </p>

                                {/* PURCHASE ACTION */}
                                {hasStock ? (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full relative overflow-hidden bg-armor text-white font-heavy uppercase py-4 text-center text-[10px] tracking-[0.2em] transition-all group-hover:bg-blood flex items-center justify-center gap-3"
                                    >
                                        <ShoppingCart size={14} />
                                        <span>Adquirir Equipo</span>
                                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-[100%]"></div>
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-void border border-armor text-armor font-heavy uppercase py-4 text-center text-[10px] tracking-[0.2em] cursor-not-allowed"
                                    >
                                        No Disponible
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
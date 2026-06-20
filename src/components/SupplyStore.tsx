'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Package, Instagram, ExternalLink, ArrowRight } from "lucide-react";

const INSTAGRAM_URL = 'https://www.instagram.com/unionnacionalista_tienda?igsh=MTZ6ZW9kbm11ZDl5MQ==';
const WHATSAPP_NUMBER = '573000000000';

interface SupplyStoreProps {
    products: any[];
}

export default function SupplyStore({ products }: SupplyStoreProps) {

    if (!products || products.length === 0) {
        return (
            <section className="py-24 px-6 md:px-16 border-b-2 border-armor-light bg-void relative overflow-hidden">
                {/* DECORATIVE BACKGROUND */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                    <Instagram size={600} />
                </div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 rounded-2xl mx-auto mb-10 flex items-center justify-center shadow-[0_0_40px_rgba(219,39,119,0.3)] border border-white/20">
                            <Instagram className="text-white" size={40} />
                        </div>
                        <span className="font-tech text-blood text-[10px] tracking-[0.5em] uppercase font-bold block mb-4">Catálogo Externo Activo</span>
                        <h2 className="font-shout text-4xl md:text-7xl text-white uppercase leading-none mb-8">
                            Tienda de <br /> Suministros
                        </h2>
                        <p className="font-body text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto border-l border-r border-armor-light px-8">
                            Nuestra plataforma de inventario web está en mantenimiento. Actualmente gestionamos el catálogo completo y pedidos exclusivos a través de nuestra cuenta oficial de Instagram.
                        </p>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <a 
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden bg-white text-void px-12 py-5 font-heavy text-xs uppercase tracking-[0.3em] hover:bg-blood hover:text-white transition-all flex items-center gap-3 w-full md:w-auto"
                            >
                                <Instagram size={18} />
                                Ver Catálogo en Instagram
                                <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-void/5 to-transparent transition-all duration-1000 group-hover:left-[100%]"></div>
                            </a>
                            <p className="font-tech text-[9px] text-steel uppercase tracking-widest">
                                Envíos nacionales <span className="text-blood">100% Garantizados</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 md:px-16 border-b-2 border-armor-light bg-paper-dark/30 relative">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-armor-light pb-8 gap-6">
                <div className="max-w-xl">
                    <span className="font-tech text-blood text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">Logística y Equipo</span>
                    <h2 className="font-heavy text-4xl md:text-6xl text-white uppercase leading-none mb-4">
                        Tienda Oficial
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
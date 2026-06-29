'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Download, FileText } from "lucide-react";

interface DoctrinaClientProps {
    posts: any[];
}

export default function DoctrinaClient({ posts }: DoctrinaClientProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts && posts.length > 0 ? (
                posts.map((post, index) => {
                    const plainText = post.content
                        ? post.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
                        : '';
                    const excerpt = plainText.length > 140
                        ? plainText.substring(0, 140) + "..."
                        : plainText;

                    const CardContainer = post.document_url ? 'a' : Link;
                    const containerProps = post.document_url 
                        ? { href: post.document_url, target: '_blank', rel: 'noopener noreferrer' }
                        : { href: `/articulos/${post.slug}` };

                    const fileExt = post.document_url ? post.document_url.split('.').pop()?.toUpperCase() : 'PDF';

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            key={post.id}
                        >
                            {/* @ts-ignore */}
                            <CardContainer {...containerProps} className="group block h-full">
                                <article className="flex flex-col h-full border border-armor-light bg-paper-dark/30 hover:border-blood/50 transition-all duration-500 overflow-hidden glow-red-hover">
                                    
                                    {/* 1. VISUAL COVER HEADER (Condicional) */}
                                    {post.image_url ? (
                                        <div className="relative h-56 overflow-hidden border-b border-armor-light">
                                            <Image
                                                src={post.image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-60"></div>
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-blood/90 backdrop-blur-sm text-white font-tech text-[9px] px-2 py-1 uppercase tracking-tighter flex items-center gap-1">
                                                    <BookOpen size={10} />
                                                    DOCTRINA
                                                </span>
                                            </div>
                                        </div>
                                    ) : post.document_url ? (
                                        /* Vista Previa de Dossier interactiva */
                                        <div className="relative h-56 bg-void/50 border-b border-armor-light flex items-center justify-center overflow-hidden p-6 group-hover:bg-void transition-colors duration-500">
                                            {/* Retícula Técnica */}
                                            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                                            
                                            {/* Ficha Editorial UNC */}
                                            <div className="relative w-28 h-36 bg-paper-dark border border-armor flex flex-col justify-between p-3 shadow-2xl transform group-hover:-translate-y-2 group-hover:rotate-1 transition-all duration-500">
                                                {/* Doblez de página */}
                                                <div className="absolute top-0 right-0 w-4 h-4 bg-armor/20 border-l border-b border-armor"></div>
                                                
                                                <div className="space-y-1">
                                                    <div className="w-10 h-1 bg-blood/75 rounded-sm"></div>
                                                    <div className="w-16 h-1 bg-white/10 rounded-sm"></div>
                                                </div>

                                                <div className="space-y-1.5 my-3">
                                                    <div className="w-full h-0.5 bg-white/10 rounded-sm"></div>
                                                    <div className="w-full h-0.5 bg-white/10 rounded-sm"></div>
                                                    <div className="w-4/5 h-0.5 bg-white/10 rounded-sm"></div>
                                                    <div className="w-full h-0.5 bg-white/10 rounded-sm"></div>
                                                    <div className="w-3/5 h-0.5 bg-white/10 rounded-sm"></div>
                                                </div>

                                                <div className="flex justify-between items-center border-t border-armor/30 pt-1.5">
                                                    <span className="font-tech text-[6px] text-steel">UNC ARCHIVE</span>
                                                    <span className="bg-blood/10 border border-blood/30 text-blood font-tech text-[7px] px-1 rounded uppercase font-bold shrink-0">
                                                        {fileExt}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="absolute top-4 left-4">
                                                <span className="bg-blood/90 backdrop-blur-sm text-white font-tech text-[9px] px-2 py-1 uppercase tracking-tighter flex items-center gap-1">
                                                    <BookOpen size={10} />
                                                    DOCTRINA
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* 2. CONTENT */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Calendar size={12} className="text-blood" />
                                            <span className="font-tech text-steel text-[9px] uppercase">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h2 className="font-heavy text-xl leading-tight mb-4 text-white group-hover:text-blood transition-colors uppercase">
                                            {post.title}
                                        </h2>

                                        <p className="text-sm text-gray-500 line-clamp-3 font-body leading-relaxed flex-grow">
                                            {excerpt}
                                        </p>

                                        {/* 3. PROMINENT BOTTOM ACTION BUTTON */}
                                        <div className="mt-6 pt-6 border-t border-armor-light/40">
                                            {post.document_url ? (
                                                <div className="w-full bg-blood text-white font-heavy text-xs uppercase py-3.5 px-4 text-center tracking-widest hover:bg-white hover:text-void transition-all duration-300 flex items-center justify-center gap-2 border border-blood shadow-lg group-hover:shadow-blood/20">
                                                    <Download size={14} className="animate-bounce" />
                                                    <span>Descargar {fileExt}</span>
                                                </div>
                                            ) : (
                                                <div className="w-full bg-armor/10 border border-armor text-steel group-hover:text-white group-hover:bg-blood group-hover:border-blood font-heavy text-xs uppercase py-3.5 px-4 text-center tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
                                                    <span>Estudiar Documento</span>
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            {/* @ts-ignore */}
                            </CardContainer>
                        </motion.div>
                    );
                })
            ) : (
                <div className="col-span-full text-center py-20 border border-dashed border-armor-light">
                    <BookOpen className="mx-auto text-armor mb-4" size={40} />
                    <p className="font-tech text-gray-500 uppercase text-xs tracking-widest">[ NO HAY DOCUMENTOS DE DOCTRINA CLASIFICADOS AÚN ]</p>
                </div>
            )}
        </div>
    );
}

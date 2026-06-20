'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";

interface NewsGridProps {
    posts: any[];
}

export default function NewsGrid({ posts }: NewsGridProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="p-6 md:p-16 border-b-2 border-armor-light bg-void relative overflow-hidden">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blood/5 blur-[120px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-armor-light pb-6 gap-4">
                <div>
                    <span className="font-tech text-blood text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">Archivo de Prensa</span>
                    <h3 className="font-heavy text-4xl md:text-5xl text-white uppercase leading-none">
                        Últimos Artículos
                    </h3>
                </div>
                <Link href="/articulos" className="group flex items-center gap-2 font-tech text-[10px] text-steel hover:text-white transition-colors uppercase tracking-widest border border-armor-light px-4 py-2 hover:border-blood">
                    Ver Archivo Histórico
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post, index) => {
                    const plainText = post.content
                        ? post.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
                        : '';
                    const excerpt = plainText.length > 120
                        ? plainText.substring(0, 120) + "..."
                        : plainText;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            key={post.id}
                        >
                            <article className="flex flex-col h-full border border-armor-light bg-paper-dark/30 hover:border-blood/50 transition-all duration-500 overflow-hidden glow-red-hover group">
                                {/* IMAGE BOX - Clickable */}
                                <Link href={`/articulos/${post.slug}`} className="relative h-56 overflow-hidden block">
                                    {post.image_url ? (
                                        <Image
                                            src={post.image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-armor text-armor-light font-heavy text-3xl">UNC</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-60"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-blood/90 backdrop-blur-sm text-white font-tech text-[9px] px-2 py-1 uppercase tracking-tighter">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>

                                {/* CONTENT BOX */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-blood" />
                                            <span className="font-tech text-steel text-[9px] uppercase">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={10} className="text-blood" />
                                            {(() => {
                                                const authorNickname = Array.isArray(post.profiles)
                                                    ? post.profiles[0]?.nickname
                                                    : post.profiles?.nickname;
                                                const finalName = authorNickname || 'UNC';

                                                return (
                                                    <Link
                                                        href={`/perfil/${authorNickname || 'unc'}`}
                                                        className="font-tech text-blood text-[8px] font-bold uppercase hover:text-white transition-colors relative z-20"
                                                    >
                                                        {finalName}
                                                    </Link>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <Link href={`/articulos/${post.slug}`} className="block group/title">
                                        <h4 className="font-heavy text-xl leading-tight mb-4 text-white group-hover/title:text-blood transition-colors uppercase">
                                            {post.title}
                                        </h4>
                                    </Link>

                                    <p className="text-sm text-gray-500 line-clamp-3 font-body leading-relaxed flex-grow">
                                        {excerpt}
                                    </p>

                                    <Link href={`/articulos/${post.slug}`} className="mt-6 pt-4 border-t border-armor-light flex justify-between items-center group/btn">
                                        <span className="font-tech text-[9px] text-steel group-hover/btn:text-white transition-colors uppercase tracking-widest">
                                            Leer más
                                        </span>
                                        <ArrowRight size={14} className="text-armor group-hover/btn:text-blood transition-colors group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
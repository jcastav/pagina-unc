'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

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

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            key={post.id}
                        >
                            <Link href={`/articulos/${post.slug}`} className="group block h-full">
                                <article className="flex flex-col h-full border border-armor-light bg-paper-dark/30 hover:border-blood/50 transition-all duration-500 overflow-hidden glow-red-hover">
                                    {/* IMAGE */}
                                    <div className="relative h-56 overflow-hidden">
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
                                            <span className="bg-blood/90 backdrop-blur-sm text-white font-tech text-[9px] px-2 py-1 uppercase tracking-tighter flex items-center gap-1">
                                                <BookOpen size={10} />
                                                DOCTRINA
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
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

                                        <div className="mt-6 pt-4 border-t border-armor-light flex justify-between items-center">
                                            <span className="font-tech text-[9px] text-steel group-hover:text-white transition-colors uppercase tracking-widest">
                                                Estudiar Documento
                                            </span>
                                            <ArrowRight size={14} className="text-armor group-hover:text-blood transition-colors group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
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

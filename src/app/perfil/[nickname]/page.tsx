"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, MapPin, Calendar, Fingerprint, Activity, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticulosGrid from "@/components/ArticulosGrid";
import Link from "next/link";

export default function PerfilPublico() {
    const params = useParams();
    const nickname = params.nickname as string;

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchPublicData = async () => {
            // Fetch profile by nickname
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('nickname', nickname)
                .single();

            if (profileError || !profileData) {
                setLoading(false);
                return;
            }

            setProfile(profileData);

            // Fetch posts by this author
            const { data: postsData } = await supabase
                .from('posts')
                .select('*, profiles(nickname)')
                .eq('author_id', profileData.id)
                .eq('status', 'PUBLICADO')
                .order('created_at', { ascending: false });

            if (postsData) setPosts(postsData);
            setLoading(false);
        };

        if (nickname) {
            fetchPublicData();
        }
    }, [nickname]);

    if (loading) return (
        <div className="min-h-screen bg-void flex items-center justify-center">
            <div className="text-center">
                <Activity className="mx-auto text-blood mb-4 animate-pulse" size={36} />
                <p className="font-tech text-blood text-xs tracking-[0.3em] uppercase animate-pulse">Consultando Registro...</p>
            </div>
        </div>
    );

    if (!profile) {
        notFound();
    }

    const roleConfig: Record<string, { color: string; label: string }> = {
        ROOT: { color: 'border-blood text-blood bg-blood/10', label: 'RAÍZ DEL SISTEMA' },
        COMANDO: { color: 'border-blue-500 text-blue-400 bg-blue-500/10', label: 'OFICIAL DE MANDO' },
        AFILIADO: { color: 'border-armor-light text-steel bg-armor/20', label: 'MIEMBRO ACTIVO' },
    };

    const role = roleConfig[profile?.role] || roleConfig.AFILIADO;

    return (
        <main className="min-h-screen bg-void text-white flex flex-col relative">
            <Navbar />

            <div className="flex-grow p-4 md:p-12 flex flex-col items-center relative overflow-hidden">
                {/* BACKGROUND DECORATION */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood/5 rounded-full blur-[150px]"></div>
                    <div className="absolute top-10 left-10 font-shout text-[200px] text-white/[0.01] leading-none select-none">UNC</div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 w-full max-w-4xl"
                >
                    <Link href="/articulos" className="inline-flex items-center gap-2 font-tech text-[10px] text-steel hover:text-white transition-colors uppercase tracking-widest mb-8 group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Archivo
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                        {/* PROFILE CARD (STAYS STICKY ON DESKTOP) */}
                        <div className="lg:sticky lg:top-32">
                            <motion.div
                                initial={{ rotateX: 10, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                className="bg-gradient-to-br from-paper-dark to-void border border-armor-light overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group hover:border-blood/50 transition-all duration-500"
                            >
                                <div className="h-1 bg-gradient-to-r from-transparent via-blood to-transparent"></div>

                                <div className="bg-armor/30 p-4 flex justify-between items-center border-b border-armor-light">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blood flex items-center justify-center">
                                            <Shield size={14} className="text-white" />
                                        </div>
                                        <span className="font-heavy text-sm tracking-widest text-white">UNC // PUBLIC</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col gap-6">
                                        {/* PHOTO PLACEHOLDER */}
                                        <div className="w-full h-48 bg-armor/50 border border-armor-light flex items-center justify-center relative overflow-hidden">
                                            <Fingerprint size={48} className="text-armor-light" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blood/10 to-transparent animate-pulse"></div>
                                        </div>

                                        {/* DATA */}
                                        <div className="space-y-5">
                                            <div>
                                                <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1">Nombre Clave</p>
                                                <h2 className="font-shout text-3xl text-white uppercase leading-none">{profile?.nickname}</h2>
                                            </div>

                                            <div>
                                                <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1">Rango</p>
                                                <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase border tracking-wider ${role.color}`}>
                                                    {profile?.role}
                                                </span>
                                                <p className="font-tech text-[8px] text-gray-600 mt-1">{role.label}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                                                        <MapPin size={8} /> Ciudad
                                                    </p>
                                                    <p className="font-tech text-xs text-white uppercase">{profile?.city}</p>
                                                </div>
                                                <div>
                                                    <p className="font-tech text-[8px] text-steel uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                                                        <Calendar size={8} /> Ingreso
                                                    </p>
                                                    <p className="font-tech text-xs text-white">
                                                        {new Date(profile?.created_at).toLocaleDateString().replace(/\//g, '.')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* USER ARTICLES */}
                        <div className="lg:col-span-2">
                            <div className="mb-8 border-b border-armor-light pb-4">
                                <h3 className="font-shout text-2xl uppercase text-white">Publicaciones</h3>
                                <p className="font-tech text-[9px] text-steel uppercase tracking-widest mt-1">Archivo de operaciones del agente</p>
                            </div>

                            <ArticulosGrid posts={posts} />
                        </div>

                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

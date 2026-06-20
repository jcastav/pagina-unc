"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, CheckCircle, AlertTriangle, Trash2, X, Send, Loader2 } from "lucide-react";

export default function ArticleManager() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");
    const [userId, setUserId] = useState("");

    const [feedbackMode, setFeedbackMode] = useState<string | null>(null);
    const [feedbackText, setFeedbackText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role || 'SOLDADO';
        setUserRole(role);

        let query = supabase
            .from('posts')
            .select('*, profiles(nickname)')
            .order('created_at', { ascending: false });

        if (role !== 'ROOT') {
            query = query.eq('author_id', user.id);
        }

        const { data, error } = await query;
        if (!error && data) setPosts(data);
        setLoading(false);
    };

    const handleStatusChange = async (postId: string, newStatus: string, feedback: string = "") => {
        const { error } = await supabase
            .from('posts')
            .update({ status: newStatus, admin_feedback: feedback })
            .eq('id', postId);

        if (!error) {
            alert(`ESTADO ACTUALIZADO A: ${newStatus}`);
            setFeedbackMode(null);
            setFeedbackText("");
            fetchData();
        }
    };

    const deletePost = async (postId: string) => {
        if (!confirm("¿CONFIRMAS LA ELIMINACIÓN TOTAL DE ESTE ARCHIVO?")) return;
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) fetchData();
    };

    const statusConfig: Record<string, { color: string; icon: any }> = {
        PUBLICADO: { color: 'border-green-600 text-green-500 bg-green-900/10', icon: CheckCircle },
        CORRECCION: { color: 'border-blood text-blood bg-blood/10', icon: AlertTriangle },
        BORRADOR: { color: 'border-yellow-600 text-yellow-500 bg-yellow-900/10', icon: Edit3 },
    };

    if (loading) return (
        <div className="text-center py-12">
            <Loader2 className="mx-auto text-blood animate-spin" size={24} />
            <p className="font-tech text-blood text-xs mt-3 tracking-[0.2em] uppercase animate-pulse">Cargando Archivos...</p>
        </div>
    );

    return (
        <div className="bg-paper-dark/30 border border-armor-light">
            {/* HEADER */}
            <div className="p-6 border-b border-armor-light flex justify-between items-center">
                <h2 className="font-heavy text-xl text-white uppercase tracking-tight">
                    {userRole === 'ROOT' ? 'Control de Prensa (ROOT)' : 'Mis Expedientes'}
                </h2>
                <span className="font-tech text-[10px] text-steel uppercase">{posts.length} registros</span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-steel font-tech text-[10px] uppercase border-b border-armor-light tracking-widest">
                            <th className="p-4">Estado</th>
                            <th className="p-4">Título</th>
                            <th className="p-4">Autor</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => {
                            const status = statusConfig[post.status] || statusConfig.PUBLICADO;
                            const StatusIcon = status.icon;

                            return (
                                <tr key={post.id} className="border-b border-armor/30 hover:bg-void/30 transition-colors text-sm text-gray-300">
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 font-bold text-[9px] uppercase border tracking-wider ${status.color}`}>
                                            <StatusIcon size={10} />
                                            {post.status || 'PUBLICADO'}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className="font-bold text-white block">{post.title}</span>
                                        {post.admin_feedback && post.status === 'CORRECCION' && (
                                            <div className="mt-2 text-blood text-[10px] bg-blood/5 p-2 border-l-2 border-blood font-tech flex items-start gap-2">
                                                <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                                                <span>{post.admin_feedback}</span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4 text-[10px] font-tech uppercase text-steel">
                                        {post.profiles?.nickname || 'DESCONOCIDO'}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/comando/redaccion?edit=${post.id}`}
                                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-tech text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-400 transition-all uppercase"
                                            >
                                                <Edit3 size={10} /> Editar
                                            </Link>

                                            {userRole === 'ROOT' && (
                                                <>
                                                    {post.status !== 'PUBLICADO' && (
                                                        <button
                                                            onClick={() => handleStatusChange(post.id, 'PUBLICADO')}
                                                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-tech text-green-400 border border-green-500/30 hover:bg-green-500/10 hover:border-green-400 transition-all uppercase"
                                                        >
                                                            <CheckCircle size={10} /> Aprobar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setFeedbackMode(post.id)}
                                                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-tech text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all uppercase"
                                                    >
                                                        <AlertTriangle size={10} /> Corregir
                                                    </button>
                                                    <button
                                                        onClick={() => deletePost(post.id)}
                                                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-tech text-blood border border-blood/30 hover:bg-blood/10 hover:border-blood transition-all uppercase"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* FEEDBACK MODAL */}
            <AnimatePresence>
                {feedbackMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-void/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-paper-dark border border-blood/30 p-6 max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.1)]"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-blood font-heavy text-lg uppercase flex items-center gap-2">
                                    <AlertTriangle size={18} /> Orden de Corrección
                                </h3>
                                <button onClick={() => setFeedbackMode(null)} className="text-steel hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <textarea
                                autoFocus
                                className="w-full bg-void/50 border border-armor-light p-4 text-white mb-4 h-32 font-body text-sm focus:border-blood outline-none transition-all placeholder-gray-600"
                                placeholder="Escribe qué debe corregir..."
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setFeedbackMode(null)} className="font-tech text-xs text-steel hover:text-white transition-colors uppercase px-4 py-2">
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleStatusChange(feedbackMode, 'CORRECCION', feedbackText)}
                                    className="bg-blood text-white px-4 py-2 font-heavy text-sm uppercase hover:bg-blood-dark transition-colors flex items-center gap-2 glow-red"
                                >
                                    <Send size={14} /> Enviar Orden
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
'use client';

import { motion } from 'framer-motion';
import { Trash2, ShieldAlert, Clock, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    nickname: string;
    role: string;
  };
}

interface ChatMessageListProps {
  messages: Message[];
  currentUser: any;
  userRole: string;
  onDeleteMessage: (messageId: string) => void;
  onBanUser: (userId: string, nickname: string) => void;
}

export default function ChatMessageList({ messages, currentUser, userRole, onDeleteMessage, onBanUser }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const canSeeDeleted = (msg: Message) => {
    if (!msg.is_deleted) return true;
    
    // ROOT ve TODO lo borrado
    if (userRole === 'ROOT') return true;

    // COMANDO ve lo borrado de AFILIADOS
    if (userRole === 'COMANDO' && msg.profiles?.role === 'AFILIADO') return true;

    return false;
  };

  const getDeletedText = (msg: Message) => {
    if (!msg.is_deleted) return msg.content;

    // Si puede ver el contenido borrado según su rol
    if (canSeeDeleted(msg)) {
       return (
         <span className="opacity-50 italic flex flex-col gap-1">
            <span className="text-[10px] text-blood uppercase font-tech flex items-center gap-1">
              <ShieldAlert size={10} /> Mensaje eliminado por moderación (Visible para ti)
            </span>
            {msg.content}
         </span>
       );
    }

    return (
      <span className="text-steel italic opacity-50 flex items-center gap-2">
        <Clock size={12} /> [Mensaje eliminado por moderación]
      </span>
    );
  };

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-95"
    >
      {messages.map((msg, index) => {
        const isOwn = msg.user_id === currentUser?.id;
        const canDelete = !msg.is_deleted && (userRole === 'ROOT' || (userRole === 'COMANDO' && msg.profiles?.role === 'AFILIADO'));

        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={msg.id}
            className={`flex flex-col gap-1 group ${isOwn ? 'items-end' : 'items-start'}`}
          >
            {/* HEADER: USER & ROLE */}
            <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex items-center gap-2">
                <span className="font-heavy text-[10px] text-white uppercase tracking-wider">
                  {msg.profiles?.nickname || 'Usuario UNC'}
                </span>
                {userRole === 'ROOT' && msg.profiles?.role !== 'ROOT' && !isOwn && (
                   <button 
                     onClick={() => onBanUser(msg.user_id, msg.profiles?.nickname || 'Usuario')}
                     className="opacity-0 group-hover:opacity-100 text-blood hover:scale-110 transition-all p-1 bg-blood/10 border border-blood/20 rounded"
                     title="BANEAR USUARIO GLOBALMENTE"
                   >
                     <ShieldAlert size={10} />
                   </button>
                )}
              </div>
              <span className={`font-tech text-[8px] px-2 py-0.5 border ${
                msg.profiles?.role === 'ROOT' ? 'border-blood text-blood' : 
                msg.profiles?.role === 'COMANDO' ? 'border-white text-white' : 'border-steel text-steel'
              } uppercase`}>
                {msg.profiles?.role || 'MIEMBRO'}
              </span>
              <span className="font-tech text-[8px] text-gray-600">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* MESSAGE BUBBLE */}
            <div className="flex items-start gap-4">
               {isOwn && canDelete && (
                 <button 
                   onClick={() => onDeleteMessage(msg.id)}
                   className="opacity-0 group-hover:opacity-100 text-steel hover:text-blood transition-all p-2"
                   title="Eliminar mensaje"
                 >
                   <Trash2 size={14} />
                 </button>
               )}

               <div className={`
                 relative px-5 py-3 border max-w-xl transition-all
                 ${msg.is_deleted ? 'border-armor-light bg-void/50' : 'border-armor-light bg-paper-dark hover:border-blood/50'}
               `}>
                 <p className="font-body text-sm text-gray-300 leading-relaxed break-words">
                   {getDeletedText(msg)}
                 </p>
               </div>

               {!isOwn && canDelete && (
                 <button 
                    onClick={() => onDeleteMessage(msg.id)}
                   className="opacity-0 group-hover:opacity-100 text-steel hover:text-blood transition-all p-2"
                   title="Moderar mensaje"
                 >
                   <Trash2 size={14} />
                 </button>
               )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

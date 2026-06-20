'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ChatSidebar from '@/components/ChatSidebar';
import ChatMessageList from '@/components/ChatMessageList';
import ChatMessageInput from '@/components/ChatMessageInput';
import { ChatSkeleton, SidebarSkeleton } from '@/components/ChatSkeletons';
import { Loader2, ShieldAlert, Menu, X } from 'lucide-react';

export default function ChatRoomPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('AFILIADO');
  const [lastReadAt, setLastReadAt] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initChat();
  }, [slug]);

  async function initChat() {
    setLoading(true);
    
    // 1. Obtener Usuario y Rol
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, last_chat_read_at')
      .eq('id', session.user.id)
      .single();
    
    const userRole = profile?.role || 'AFILIADO';
    setRole(userRole);
    setLastReadAt((profile?.last_chat_read_at as Record<string, string>) || {});

    // 2. Obtener Salas Disponibles según Rol
    const { data: availableRooms } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (availableRooms) {
      setRooms(availableRooms);
      const current = availableRooms.find(r => r.slug === slug);
      if (current) {
        setActiveRoom(current);
        await fetchMessages(current.id);
        markAsRead(current.id, (profile?.last_chat_read_at as Record<string, string>) || {});
      } else {
        setError("Habitación no encontrada o acceso restringido.");
      }
    }
    
    setLoading(false);
  }

  async function markAsRead(roomId: string, currentReadAt: Record<string, string>) {
    const newReadAt = { ...currentReadAt, [roomId]: new Date().toISOString() };
    setLastReadAt(newReadAt);
    
    await supabase
      .from('profiles')
      .update({ last_chat_read_at: newReadAt })
      .eq('id', user?.id || (await supabase.auth.getUser()).data.user?.id);
  }

  async function fetchMessages(roomId: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles(nickname, role)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (data) setMessages(data);
  }

  useEffect(() => {
    // Monitor global de mensajes para notificaciones en el Sidebar
    const globalChannel = supabase
      .channel('global-chat-monitor')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        setRooms(prev => prev.map(room => {
          if (room.id === payload.new.room_id) {
            return { ...room, last_message_at: payload.new.created_at };
          }
          return room;
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, []);

  useEffect(() => {
    if (!activeRoom?.id) return;

    // Suscribirse a nuevos mensajes y actualizaciones (borrados) de forma limpia
    const channel = supabase
      .channel(`chat:${activeRoom.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages', 
        filter: `room_id=eq.${activeRoom.id}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          fetchMessageWithProfile(payload.new.id);
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom?.id]);

  async function fetchMessageWithProfile(messageId: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles(nickname, role)')
      .eq('id', messageId)
      .single();
    
    if (data) {
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  }

  async function handleSendMessage(content: string) {
    if (!activeRoom || !user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: activeRoom.id,
        user_id: user.id,
        content: content
      });
    
    if (error) {
      alert("Error al enviar mensaje. Posible baneo o restricción de rol.");
    }
  }

  async function handleDeleteMessage(messageId: string) {
    const { error } = await supabase
      .from('chat_messages')
      .update({ 
        is_deleted: true,
        deleted_by: user.id
      })
      .eq('id', messageId);
      
    if (error) {
      alert("No tienes permisos suficientes para moderar este mensaje.");
    }
  }

  async function handleBanUser(userId: string, nickname: string) {
    const confirmed = window.confirm(`¿ESTÁ SEGURO DE BANEAR GLOBALMENTE A ${nickname}?\nEsta acción es irreversible y bloqueará el acceso total a la plataforma.`);
    
    if (confirmed) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: true })
        .eq('id', userId);
        
      if (error) {
        alert("Error al ejecutar el baneo. Verifique sus permisos de rango superior.");
      } else {
        alert(`USUARIO ${nickname} HA SIDO BANEADO DE LA PLATAFORMA.`);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-grow flex h-[800px] max-h-[85vh] overflow-hidden">
        <aside className="hidden lg:block w-64 border-r border-armor-light">
          <SidebarSkeleton />
        </aside>
        <div className="flex-grow bg-paper-dark/20">
          <ChatSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-void p-8 text-center min-h-[600px]">
        <ShieldAlert size={64} className="text-blood mb-6 opacity-50" />
        <h2 className="font-shout text-4xl text-white uppercase mb-4">Acceso Denegado</h2>
        <p className="font-body text-gray-500 max-w-md">{error}</p>
        <button onClick={() => router.push('/chat')} className="mt-8 font-tech text-xs text-blood underline uppercase tracking-widest">Volver al General</button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex h-[calc(100vh-64px)] lg:h-[800px] lg:max-h-[85vh] overflow-hidden relative">
      <ChatSidebar 
        rooms={rooms} 
        activeRoomId={activeRoom?.id} 
        userRole={role} 
        lastReadAt={lastReadAt}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-grow flex flex-col bg-paper-dark/20 h-full overflow-hidden relative">
        {/* ROOM HEADER */}
        <header className="p-4 bg-void border-b border-armor-light flex items-center justify-between z-10 shadow-lg">
           <div className="flex items-center gap-4">
             {/* MOBILE TOGGLE */}
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="lg:hidden text-steel hover:text-white p-1"
             >
               {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
             <div>
               <h2 className="font-heavy text-lg text-white uppercase tracking-tighter"># {activeRoom?.name}</h2>
               <p className="font-tech text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">{activeRoom?.description}</p>
             </div>
           </div>
           <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
               <span className="font-tech text-[10px] text-white uppercase">Servidor Institucional Seguro</span>
             </div>
           </div>
        </header>

        {/* MESSAGES */}
        <ChatMessageList 
          messages={messages} 
          currentUser={user} 
          userRole={role}
          onDeleteMessage={handleDeleteMessage}
          onBanUser={handleBanUser}
        />

        {/* INPUT */}
        <ChatMessageInput 
          onSendMessage={handleSendMessage} 
          isMuted={false} // Todo: Implement logic for muted
        />
      </div>
    </div>
  );
}

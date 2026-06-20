'use client';

import { Hash, Lock, Shield, Settings } from 'lucide-react';
import Link from 'next/link';

interface ChatSidebarProps {
  rooms: any[];
  activeRoomId: string;
  userRole: string;
  lastReadAt?: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({
  rooms,
  activeRoomId,
  userRole,
  lastReadAt = {},
  isOpen,
  onClose
}: ChatSidebarProps) {
  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-void/80 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:flex w-64 bg-paper-dark lg:bg-paper-dark/50 border-r border-armor-light flex-col h-full transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* SIDEBAR HEADER */}
        <div className="p-4 border-b border-armor-light flex items-center justify-between bg-armor/10">
          <h3 className="font-tech text-xs text-white uppercase tracking-widest font-bold">Canales</h3>
          {userRole === 'ROOT' && (
            <button title="Añadir Canal" className="text-steel hover:text-white transition-colors">
              <Settings size={14} />
            </button>
          )}
        </div>

        {/* ROOM LIST */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {rooms.map((room) => {
            const isActive = room.id === activeRoomId;
            const isRestricted = room.min_role !== 'AFILIADO';

            // Lógica de "No leídos"
            const lastRead = lastReadAt[room.id] ? new Date(lastReadAt[room.id]).getTime() : 0;
            const lastMsg = room.last_message_at ? new Date(room.last_message_at).getTime() : 0;
            const hasUnread = !isActive && lastMsg > lastRead;

            return (
              <Link
                key={room.id}
                href={`/chat/${room.slug}`}
                className={`
                group flex items-center gap-3 px-3 py-2 transition-all duration-200
                ${isActive
                    ? 'bg-blood text-white'
                    : 'text-steel hover:bg-armor/20 hover:text-white'
                  }
              `}
              >
                <div className="flex-shrink-0">
                  {isRestricted ? (
                    <Lock size={14} className={isActive ? 'text-white' : 'text-blood'} />
                  ) : (
                    <Hash size={16} className={isActive ? 'text-white' : 'text-steel'} />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <span className="block truncate font-heavy text-xs uppercase tracking-tight">
                    {room.name}
                  </span>
                  {room.min_role !== 'AFILIADO' && (
                    <span className={`text-[8px] font-tech uppercase ${isActive ? 'text-white/70' : 'text-blood/70'}`}>
                      Acceso: {room.min_role}
                    </span>
                  )}
                </div>
                {/* INDICADOR DE NO LEÍDOS */}
                <div className={`w-2 h-2 rounded-full bg-blood shadow-[0_0_8px_#ef4444] transition-all ${hasUnread ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}`}></div>
              </Link>
            );
          })}
        </nav>

        {/* USER INFO PANEL (Footer del sidebar) */}
        <div className="p-4 bg-void border-t border-armor-light flex items-center gap-3">
          <div className="w-8 h-8 bg-blood/10 border border-blood/30 flex items-center justify-center">
            <Shield size={16} className="text-blood" />
          </div>
          <div className="flex-grow min-w-0">
            <span className="block truncate font-heavy text-[10px] text-white uppercase tracking-widest">
              Sesión Activa
            </span>
            <span className="block font-tech text-[8px] text-steel uppercase">
              Rango: {userRole}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import { Send, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageInputProps {
  onSendMessage: (content: string) => void;
  isMuted?: boolean;
}

export default function ChatMessageInput({ onSendMessage, isMuted }: ChatMessageInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isMuted) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  return (
    <div className="p-6 bg-void border-t border-armor-light">
      {isMuted ? (
        <div className="flex items-center justify-center gap-3 bg-blood/10 border border-blood/20 p-4">
          <AlertTriangle className="text-blood" size={18} />
          <span className="font-tech text-xs text-blood uppercase tracking-widest font-bold">
            Tu cuenta ha sido silenciada temporalmente por moderación.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un mensaje para la unidad..."
            className="w-full bg-paper-dark border-2 border-armor-light px-6 py-4 pr-16 text-white font-body text-sm focus:outline-none focus:border-blood transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-steel hover:text-white group-hover:text-blood transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      <div className="mt-2 flex justify-between items-center px-1">
         <span className="font-tech text-[8px] text-gray-600 uppercase">Comunicaciones Encriptadas UNC</span>
         <span className="font-tech text-[8px] text-gray-600 uppercase">Presiona Enter para enviar</span>
      </div>
    </div>
  );
}

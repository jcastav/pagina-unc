'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export default function ValueCard({ title, description, icon: Icon, index }: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-paper-dark/30 border border-armor-light p-8 hover:border-blood/50 transition-all duration-500 overflow-hidden glow-red-hover"
    >
      {/* Detalle visual de esquina técnica */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blood/20 group-hover:border-blood transition-colors"></div>
      
      <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-blood/10 border border-blood/20 text-blood">
        <Icon size={24} />
      </div>

      <h3 className="font-heavy text-xl text-white uppercase mb-4 tracking-tight group-hover:text-blood transition-colors">
        {title}
      </h3>
      
      <p className="font-body text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

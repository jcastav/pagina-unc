'use client';

import { ShieldCheck, Globe, Target, BookOpen } from 'lucide-react';
import ValueCard from './ValueCard';

export default function PrinciplesSection() {
  const pillars = [
    {
      title: "Alzatismo & Orden",
      description: "Reivindicamos el legado de Gilberto Alzate Avendaño: la primacía de la voluntad nacional y el orden jerárquico frente al liberalismo.",
      icon: ShieldCheck
    },
    {
      title: "Identidad Hispánica",
      description: "Defensa de la integración de las etnias históricas que configuran nuestra estructura demográfica y herencia católica.",
      icon: Globe
    },
    {
      title: "Doctrina Social",
      description: "El catolicismo tradicionalista como eje moral y rector del bienestar común y la justicia social en Colombia.",
      icon: Target
    },
    {
      title: "Corporativismo",
      description: "Promovemos un Estado corporativo como alternativa al colectivismo radical y la atomización liberal del individuo.",
      icon: BookOpen
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pillars.map((pillar, i) => (
        <ValueCard key={i} {...pillar} index={i} />
      ))}
    </div>
  );
}

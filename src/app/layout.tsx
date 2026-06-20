import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // <--- Usamos Google Fonts
import "./globals.css";

// Configuración de fuentes automáticas (No requiere archivos locales)
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UNC", // Título por defecto
    template: "%s | UNC Oficial",      // Para subpáginas: "Noticias | UNC Oficial"
  },
  description: "Plataforma oficial del movimiento. Comunicados, doctrina y logística operativa.",

  // Palabras clave para Google
  keywords: ["nacionalismo", "colombia", "movimiento", "resistencia", "unc", "política"],

  // Cómo se ve en WhatsApp / Facebook / LinkedIn
  openGraph: {
    title: "UNC | Unión Nacionalista Colombiana",
    description: "Accede al sistema oficial.",
    url: "https://unc-plataforma.vercel.app/", // Pon tu URL real de Vercel aquí si la tienes
    siteName: "UNC Sistema Central",
    locale: "es_CO",
    type: "website",
  },

  // Cómo se ve en Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "UNC | Unión Nacionalista Colombiana",
    description: "Plataforma oficial del movimiento nacionalista.",
  },

  // Íconos (Favicon)
  icons: {
    icon: "/favicon.ico", // Tienes que poner tu logo en la carpeta public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${sans.variable} ${mono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
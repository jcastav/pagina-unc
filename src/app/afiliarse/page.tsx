import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AfiliacionForm from "@/components/AfiliacionForm"; // Importamos el componente

export default function AfiliarsePage() {
  return (
    <main className="min-h-screen flex flex-col bg-void text-white">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full border-x border-armor p-6 md:p-12 flex flex-col items-center justify-center">
        
        <div className="max-w-2xl w-full border border-armor bg-paper-dark p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="mb-8 text-center">
                <span className="bg-blood text-white font-tech text-[10px] px-2 py-1 mb-2 inline-block">RECLUTAMIENTO FASE 1</span>
                <h1 className="font-heavy text-3xl md:text-4xl text-white mb-2 uppercase">Formulario de Ingreso</h1>
                <p className="font-tech text-xs text-steel">
                    TUS DATOS SERÁN TRATADOS CON <span className="text-white font-bold">PROTOCOLOS DE SEGURIDAD DE NIVEL ALTO</span>. 
                    NO COMPARTIMOS INFORMACIÓN CON TERCEROS.
                </p>
            </div>
            
            {/* Aquí cargamos el formulario real */}
            <AfiliacionForm />
            
        </div>

      </div>
      <Footer />
    </main>
  );
}
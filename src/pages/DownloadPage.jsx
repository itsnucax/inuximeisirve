import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { DownloadCloud } from 'lucide-react';

const DownloadPage = () => {
    const { toast } = useToast();

    return (
        <motion.div
            key="descargar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto px-4 py-32 text-center"
        >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              <DownloadCloud className="mx-auto h-24 w-24 text-[var(--accent-primary)] mb-6" />
              <h2 className="text-4xl font-bold mb-4">Descargar Herramientas</h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8">Accede a nuestras herramientas especializadas para técnicos. El acceso está restringido a usuarios con planes activos.</p>
              
              <button 
                className="btn-primary text-lg px-10 py-4"
                onClick={() => toast({
                    title: "🚧 Descarga no disponible",
                    description: "¡Esta característica no está implementada aún—pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
                })}
              >
                Descargar Ahora
              </button>
            </motion.div>
        </motion.div>
    );
};

export default DownloadPage;
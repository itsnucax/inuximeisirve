import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Gem, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const toolServices = [
  { id: 1, name: 'Alquiler Herramienta X (1 mes)', price: '$20' },
  { id: 2, name: 'Acceso a Suite Y (1 semana)', price: '$15' },
  { id: 3, name: 'Licencia de Software Z (3 meses)', price: '$50' }
];

const ToolRentalPage = () => {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [selectedService, setSelectedService] = useState(toolServices[0]);

    const handleServiceChange = (e) => {
        const serviceId = parseInt(e.target.value, 10);
        const service = toolServices.find(s => s.id === serviceId);
        setSelectedService(service);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
          title: "🚧 Función no implementada",
          description: `¡La renta de "${selectedService.name}" no está implementada aún—pero puedes solicitarlo en tu próximo prompt! 🚀`
        });
    }

    return (
        <motion.div
            key="dhru-rental"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 py-32"
        >
            <h2 className="text-4xl font-bold text-center mb-4">Renta de Herramientas</h2>
            <p className="text-center text-[var(--text-secondary)] mb-12">Alquila acceso a nuestras herramientas premium.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] h-full">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
                             <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Selecciona una Herramienta</label>
                                <select 
                                    className="form-input" 
                                    onChange={handleServiceChange}
                                    value={selectedService.id}
                                >
                                    {toolServices.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-right text-sm font-bold text-[var(--accent-primary)] mt-2">{selectedService.price}</p>
                            </div>
                            <div className="flex-grow">
                                <label htmlFor="identifier" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Tu Identificador (Usuario, HWID, etc.)</label>
                                <input
                                    id="identifier"
                                    type="text"
                                    className="form-input w-full"
                                    placeholder="Ingresa el identificador requerido"
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="md:col-span-1">
                     <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] text-center flex flex-col justify-between h-full">
                        <div>
                            <Wrench className="w-16 h-16 mx-auto text-[var(--accent-primary)] mb-4" />
                            <p className="text-5xl font-bold mb-2">{selectedService.price}</p>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">Simplemente complete los datos y proceda a pagar sus pedidos utilizando su saldo.</p>
                            <div className="flex items-center justify-center gap-2 text-lg">
                                <Gem className="w-5 h-5 text-[var(--accent-primary)]" />
                                <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="btn-primary w-full mt-8 flex items-center justify-center gap-2" disabled={loading}>
                           {loading ? <div className="loading-spinner"></div> : <><Send className="w-5 h-5"/> Rentar Herramienta</>}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ToolRentalPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Trash2, Gem } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterSerialPage = () => {
  const { user, loading, registerSerial } = useAuth();
  const { toast } = useToast();
  const [serialForm, setSerialForm] = useState({ ecid: '', service: '' });

  const services = [
    { name: 'GSM', id: 1 },
    { name: 'Meid', id: 2 },
    { name: 'Ramdisk Hello', id: 2 },
    { name: 'Ramdisk Passcode', id: 11 },
    { name: 'Passcode iOS 12-14', id: 3 },
    { name: 'Baseband', id: 4 },
    { name: 'MDM', id: 10 },
    { name: 'Remove Account', id: 14 },
    { name: 'Open Menu', id: 1 },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!serialForm.ecid || !serialForm.service) {
      toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
      return;
    }
    const selectedService = services.find(s => s.id === parseInt(serialForm.service));
    const success = await registerSerial({ ecid: serialForm.ecid, service: selectedService.name, serviceId: serialForm.service });
    if (success) {
      setSerialForm({ ecid: '', service: '' });
    }
  };
  
  const handleNotImplemented = () => {
    toast({
        title: "🚧 Función no implementada",
        description: "¡Esta característica no está implementada aún—pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
      });
  }

  return (
    <motion.div
      key="registrar-serial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-4">Registrar Serial</h2>
      <p className="text-center text-[var(--text-secondary)] mb-8">Cada registro tiene un costo de 5 créditos.</p>
      
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">ECID / Serial</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ingresa el ECID del dispositivo"
              value={serialForm.ecid}
              onChange={(e) => setSerialForm({ ...serialForm, ecid: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Servicio</label>
            <select
              className="form-input"
              value={serialForm.service}
              onChange={(e) => setSerialForm({ ...serialForm, service: e.target.value })}
            >
              <option value="">Selecciona un servicio</option>
              {services.map(service => (
                <option key={`${service.name}-${service.id}`} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 text-center text-[var(--text-secondary)]">
            <p className="flex items-center justify-center gap-2">
                <Gem className="w-5 h-5 text-[var(--accent-primary)]"/> 
                <span>Créditos disponibles: {user?.credits || 0}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : <><Check className="w-5 h-5" /> Registrar</>}
            </button>
            <button type="button" className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={handleNotImplemented}>
              <AlertCircle className="w-5 h-5" /> Verificar
            </button>
            <button type="button" className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={handleNotImplemented}>
              <Trash2 className="w-5 h-5" /> Eliminar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterSerialPage;
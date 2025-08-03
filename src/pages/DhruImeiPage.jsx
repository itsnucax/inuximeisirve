import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Gem, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DhruImeiPage = () => {
  const { user, loading, services } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [imeiList, setImeiList] = useState('');

  useEffect(() => {
    const imeiServices = services.filter(s => s.SERVICETYPE === 'IMEI');
    setSelectedService(imeiServices[0] || null);
  }, [services]);

  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value, 10);
    const service = services.find(s => s.SERVICEID === serviceId);
    setSelectedService(service);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !imeiList.trim()) {
      toast({ title: 'Error', description: 'Por favor, selecciona un servicio y agrega al menos un IMEI.', variant: 'destructive' });
      return;
    }
    const imeiArray = imeiList.split('\n').map(imei => imei.trim()).filter(imei => imei);
    if (imeiArray.length > 100) {
      toast({ title: 'Error', description: 'Máximo 100 IMEIs por registro.', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch('https://inuxteam.com/proxy.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
        body: JSON.stringify({
          action: 'placeimeiorder',
          imei: imeiArray[0], // Solo envía el primer IMEI por ahora
          serviceId: selectedService.SERVICEID,
        }),
      });

      const text = await response.text();
      console.log('Respuesta cruda del servidor:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        toast({ title: 'Error', description: 'Respuesta inválida del servidor.', variant: 'destructive' });
        return;
      }

      console.log('Respuesta procesada del servidor:', result);

      if (response.ok) {
        if (result.SUCCESS && result.SUCCESS.length > 0) {
          const message = result.SUCCESS[0].MESSAGE;
          if (message && message.toLowerCase().includes('received')) { // Ajustado a "received" por "Order received"
            toast({ title: 'Éxito', description: message || 'Orden registrada correctamente.', variant: 'default' });
            setImeiList(''); // Limpia el textarea
          } else {
            toast({ title: 'Error', description: message || 'Error al procesar la orden.', variant: 'destructive' });
          }
        } else if (result.ERROR && result.ERROR.length > 0) {
          const message = result.ERROR[0].MESSAGE;
          toast({ title: 'Error', description: message || 'Error al procesar la orden.', variant: 'destructive' });
        } else {
          toast({ title: 'Error', description: 'Respuesta inesperada del servidor.', variant: 'destructive' });
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Error al procesar la orden. Revisa la consola para más detalles.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      toast({ title: 'Error', description: 'Error de conexión con el servidor. Revisa la consola para más detalles.', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      key="dhru-imei"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-4">Servicios de IMEI</h2>
      <p className="text-center text-[var(--text-secondary)] mb-12">Registra tus servicios por IMEI aquí.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Selecciona un Servicio</label>
                <select 
                  className="form-input" 
                  onChange={handleServiceChange}
                  value={selectedService?.SERVICEID || ''}
                >
                  {services.filter(s => s.SERVICETYPE === 'IMEI').map(service => (
                    <option key={service.SERVICEID} value={service.SERVICEID}>
                      {service.SERVICENAME} (${parseFloat(service.CREDIT).toFixed(2)})
                    </option>
                  ))}
                </select>
                <p className="text-right text-sm font-bold text-[var(--accent-primary)] mt-2">${selectedService ? parseFloat(selectedService.CREDIT).toFixed(2) : '0.00'}</p>
              </div>
              <div className="mt-4 flex-grow">
                <label htmlFor="imei-list" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Lista de IMEI (uno por línea)</label>
                <textarea 
                  id="imei-list"
                  value={imeiList}
                  onChange={(e) => setImeiList(e.target.value)}
                  className="form-input h-full min-h-[200px] resize-none"
                  placeholder="123456789012345
543210987654321"
                ></textarea>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">Puedes ordenar un máximo de 100 servicios de IMEI.</p>
            </form>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] text-center flex flex-col justify-between h-full">
            <div>
              <Smartphone className="w-16 h-16 mx-auto text-[var(--accent-primary)] mb-4" />
              <p className="text-5xl font-bold mb-2">${selectedService ? parseFloat(selectedService.CREDIT).toFixed(2) : '0.00'}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Simplemente complete los datos y proceda a pagar sus pedidos utilizando su saldo.</p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Gem className="w-5 h-5 text-[var(--accent-primary)]" />
                <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-8 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : <><Send className="w-5 h-5"/> Registrar Servicio Premium</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DhruImeiPage;
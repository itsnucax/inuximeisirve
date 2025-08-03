import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Gem, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DhruServerPage = () => {
  const { user, loading, services } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [orders, setOrders] = useState([]); // Estado para el historial de pedidos

  useEffect(() => {
    const serverServices = services.filter(s => s.SERVICETYPE === 'SERVER');
    setSelectedService(serverServices[0] || null);
  }, [services]);

  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value, 10);
    const service = services.find(s => s.SERVICEID === serviceId);
    setSelectedService(service);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !identifier.trim()) {
      toast({ title: 'Error', description: 'Por favor, selecciona un servicio y agrega un identificador.', variant: 'destructive' });
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
          action: 'placeserverorder', // Ajusta según la acción correcta de la API
          identifier: identifier, // Enviar el identificador (ajusta el nombre según la API)
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
          if (message && message.toLowerCase().includes('received')) {
            // Agregar al historial
            const newOrder = {
              id: Date.now(), // ID temporal basado en timestamp
              serviceName: selectedService.SERVICENAME,
              identifier: identifier,
              referenceId: result.SUCCESS[0].REFERENCEID,
              status: 'Received',
              date: new Date().toISOString(),
            };
            setOrders([...orders, newOrder]);
            toast({ title: 'Éxito', description: message || 'Orden registrada correctamente.', variant: 'default' });
            setIdentifier(''); // Limpia el input
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
      key="dhru-server"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-4">Servicios de Servidor</h2>
      <p className="text-center text-[var(--text-secondary)] mb-12">Registra tus servicios de servidor aquí.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Selecciona un Servicio</label>
                <select 
                  className="form-input" 
                  onChange={handleServiceChange}
                  value={selectedService?.SERVICEID || ''}
                >
                  {services.filter(s => s.SERVICETYPE === 'SERVER').map(service => (
                    <option key={service.SERVICEID} value={service.SERVICEID}>
                      {service.SERVICENAME} (${parseFloat(service.CREDIT).toFixed(2)})
                    </option>
                  ))}
                </select>
                <p className="text-right text-sm font-bold text-[var(--accent-primary)] mt-2">${selectedService ? parseFloat(selectedService.CREDIT).toFixed(2) : '0.00'}</p>
              </div>
              <div className="flex-grow">
                <label htmlFor="identifier" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Identificador (Usuario, Email, etc.)</label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
              <Server className="w-16 h-16 mx-auto text-[var(--accent-primary)] mb-4" />
              <p className="text-5xl font-bold mb-2">${selectedService ? parseFloat(selectedService.CREDIT).toFixed(2) : '0.00'}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Simplemente complete los datos y proceda a pagar sus pedidos utilizando su saldo.</p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Gem className="w-5 h-5 text-[var(--accent-primary)]" />
                <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-8 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : <><Send className="w-5 h-5"/> Registrar Servicio</>}
            </button>
          </div>
        </div>
      </div>

      {/* Historial de pedidos */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Historial de Pedidos</h3>
        {orders.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)]">No hay pedidos registrados aún.</p>
        ) : (
          <div className="glass-effect rounded-2xl p-6 border border-[var(--border-color)]">
            {orders.map(order => (
              <div key={order.id} className="mb-4 p-4 border-b border-[var(--border-color)] last:border-b-0">
                <p><strong>Servicio:</strong> {order.serviceName}</p>
                <p><strong>Identificador:</strong> {order.identifier}</p>
                <p><strong>Referencia:</strong> {order.referenceId}</p>
                <p><strong>Estado:</strong> {order.status}</p>
                <p><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DhruServerPage;
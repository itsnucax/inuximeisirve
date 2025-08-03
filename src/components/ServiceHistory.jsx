import React, { useState, useEffect } from 'react';
import { History, List } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge'; // Ajusta la ruta según tu estructura

const ServiceHistory = () => {
  const { user, getServiceHistory } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getServiceHistory();
      setHistory(data);
    };
    fetchHistory();
  }, [getServiceHistory]);

  return (
    <div className=" rounded-2xl p-8 border border-[var(--border-color)]">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <History className="w-7 h-7 text-[var(--accent-primary)]" /> Historial de Servicios Global
      </h3>
      <div className="overflow-x-auto max-h-[500px]">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="p-3">Usuario</th>
                <th className="p-3">Servicio</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Costo</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={`${item.id}-${index}`}
                  className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="p-3 font-semibold">{user?.username || 'N/A'}</td>
                  <td className="p-3">{item.service}</td>
                  <td className="p-3 text-sm text-[var(--text-secondary)]">{item.date || 'N/A'}</td>
                  <td className="p-3">
                    <StatusBadge status={item.status || 'Pendiente'} />
                  </td>
                  <td className="p-3 text-right font-semibold">{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <List className="w-12 h-12 mx-auto mb-4 text-[var(--border-color)]" />
            No hay historial de servicios todavía.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;
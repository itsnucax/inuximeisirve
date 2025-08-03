
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { List, X, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Finalizado': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'Cancelado': return <XCircle className="w-5 h-5 text-red-500" />;
        case 'Pedido Pendiente': return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'Aceptado': return <AlertTriangle className="w-5 h-5 text-blue-500" />;
        default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
};

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5";
    switch (status) {
        case 'Finalizado': return <span className={`${baseClasses} bg-green-500/10 text-green-400`}><CheckCircle className="w-4 h-4"/>{status}</span>;
        case 'Cancelado': return <span className={`${baseClasses} bg-red-500/10 text-red-400`}><XCircle className="w-4 h-4"/>{status}</span>;
        case 'Pedido Pendiente': return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400`}><Clock className="w-4 h-4"/>{status}</span>;
        case 'Aceptado': return <span className={`${baseClasses} bg-blue-500/10 text-blue-400`}><AlertTriangle className="w-4 h-4"/>{status}</span>;
        default: return <span className={`${baseClasses} bg-gray-500/10 text-gray-400`}><Clock className="w-4 h-4"/>{status}</span>;
    }
};

const DhruHistorialPage = () => {
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(user?.dhru_orders || []);

    useEffect(() => {
        setOrders(user?.dhru_orders || []);
    }, [user]);

    const handleSelectOrder = async (order) => {
        setSelectedOrder(order);
        try {
            const response = await fetch('https://inuxteam.com/api/get_imei_orders_details.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id })
            });
            const data = await response.json();
            if (response.ok && data.order) {
                const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: data.order.status } : o);
                setOrders(updatedOrders);
                setSelectedOrder(prev => prev ? { ...prev, status: data.order.status } : prev);
            }
        } catch (err) {
            console.error('Error al actualizar el pedido:', err);
        }
    };

    return (
        <>
            <motion.div
                key="dhru-historial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 py-32"
            >
                <h2 className="text-4xl font-bold text-center mb-4">Historial de Servicios DHRU</h2>
                <p className="text-center text-[var(--text-secondary)] mb-12">Aquí puedes ver el estado de todos tus pedidos.</p>

                <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="p-4">ID Pedido</th>
                                    <th className="p-4">Servicio</th>
                                    <th className="p-4">Identificador</th>
                                    <th className="p-4 text-center">Estado</th>
                                    <th className="p-4 text-right">Costo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.length > 0 ? (
                                    orders.map(order => (
                                        <tr key={order.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer" onClick={() => handleSelectOrder(order)}>
                                            <td className="p-4 font-mono text-sm text-[var(--accent-primary)]">{order.id}</td>
                                            <td className="p-4 font-semibold">{order.service}</td>
                                            <td className="p-4 font-mono text-sm">{order.identifier}</td>
                                            <td className="p-4 text-center"><StatusBadge status={order.status} /></td>
                                            <td className="p-4 text-right font-semibold">${parseFloat(order.cost).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-[var(--text-secondary)] py-16">
                                            <List className="w-12 h-12 mx-auto mb-4 text-[var(--border-color)]" />
                                            No tienes pedidos en tu historial.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="glass-effect rounded-2xl p-8 border border-[var(--border-color)] w-full max-w-2xl text-sm"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold">Detalles del Pedido {selectedOrder.id}</h3>
                                    <p className="text-[var(--text-secondary)]">{selectedOrder.service}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 -mr-2 -mt-2 rounded-full hover:bg-[var(--accent-primary)]/10"><X className="w-6 h-6"/></button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">IDENTIFICADOR</p>
                                    <p className="font-mono font-semibold">{selectedOrder.identifier}</p>
                                </div>
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">CÓDIGO</p>
                                    <div className="flex items-center gap-2 font-semibold">
                                        <StatusIcon status={selectedOrder.status}/>
                                        <span>{selectedOrder.status}</span>
                                    </div>
                                </div>
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">COSTO</p>
                                    <p className="font-bold text-2xl text-[var(--accent-primary)]">${parseFloat(selectedOrder.cost).toFixed(2)}</p>
                                </div>
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">ACCIÓN DE ESPERA</p>
                                    <p className="font-semibold">{selectedOrder.response || 'N/A'}</p>
                                </div>
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">FECHA</p>
                                    <p className="font-semibold">{selectedOrder.date}</p>
                                </div>
                                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">RESPUESTA EN</p>
                                    <p className="font-semibold">{selectedOrder.replied_in}</p>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DhruHistorialPage;

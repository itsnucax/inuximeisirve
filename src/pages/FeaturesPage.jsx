import React from 'react';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
    const features = [
        { title: 'Soporte 24/7', description: 'Nuestro equipo está disponible las 24 horas del día, los 7 días de la semana para ayudarte con cualquier problema.' },
        { title: 'Múltiples Dispositivos', description: 'Compatibilidad con una amplia gama de dispositivos Samsung, Xiaomi, Apple y más.' },
        { title: 'Proceso Rápido', description: 'Procesamiento rápido y eficiente de todos los servicios de bypass y desbloqueo.' },
        { title: 'Seguridad Garantizada', description: 'Todos los procesos son seguros y no dañan el firmware original del dispositivo.' },
        { title: 'Actualizaciones Constantes', description: 'Actualizamos nuestras herramientas constantemente para soportar los últimos dispositivos y versiones de software.' },
        { title: 'Panel de Usuario Intuitivo', description: 'Gestiona tus registros y créditos fácilmente desde tu panel personal.' },
      ];

  return (
    <motion.div
      key="caracteristicas"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-16">Características Principales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
             <motion.div
                key={feature.title}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
             >
                <h3 className="text-xl font-semibold mb-3 text-[var(--accent-primary)]">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">{feature.description}</p>
            </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesPage;
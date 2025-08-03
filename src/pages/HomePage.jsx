import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shield, KeyRound, RadioTower, Cloud, LockKeyhole, UserX, Wrench } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HomePage = ({ setActiveTab }) => {
    const { toast } = useToast();

    const services = [
      { 
        title: 'Liberaciones', 
        description: 'Servicios de liberación de red para una amplia gama de dispositivos.',
        icon: <RadioTower className="w-10 h-10" />
      },
      { 
        title: 'Bypass A12+', 
        description: 'Bypass para dispositivos Apple con procesadores A12 y superiores.',
        icon: <Shield className="w-10 h-10" />
      },
      { 
        title: 'FRP', 
        description: 'Eliminación de Factory Reset Protection en múltiples marcas.',
        icon: <Smartphone className="w-10 h-10" />
      },
      { 
        title: 'Activaciones', 
        description: 'Servicios de activación para diversas herramientas y software.',
        icon: <KeyRound className="w-10 h-10" />
      },
      { 
        title: 'Bypass iCloud', 
        description: 'Soluciones efectivas para el bloqueo de activación de iCloud.',
        icon: <Cloud className="w-10 h-10" />
      },
      { 
        title: 'Desbloqueos MDM', 
        description: 'Eliminación de gestión de dispositivos móviles en cualquier modelo.',
        icon: <LockKeyhole className="w-10 h-10" />
      },
      { 
        title: 'Cuentas MI de Raíz', 
        description: 'Eliminación permanente de cuentas MI en dispositivos Xiaomi.',
        icon: <UserX className="w-10 h-10" />
      },
      { 
        title: 'Soporte Remoto', 
        description: 'Asistencia técnica especializada a distancia para solucionar problemas.',
        icon: <Wrench className="w-10 h-10" />
      }
    ];

      const handleServiceClick = (serviceTitle) => {
        toast({
          title: "🚧 Servicio no implementado",
          description: `El servicio "${serviceTitle}" aún no está disponible. ¡Puedes solicitarlo en tu próximo prompt! 🚀`
        });
      };

    return (
        <motion.div
            key="inicio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
        >
            <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.h1 
                        className="hero-title text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Inux Team Support
                    </motion.h1>
                    
                    <motion.p 
                        className="hero-subtitle text-xl md:text-2xl mb-10 text-[var(--text-primary)]"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Soluciones Profesionales 24/7
                    </motion.p>
                    
                    <motion.button 
                        className="btn-primary text-lg px-10 py-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
                        onClick={() => setActiveTab('registrar-serial')}
                    >
                        Comenzar Ahora
                    </motion.button>
                </div>
            </section>

            <section className="py-24 bg-[var(--bg-secondary)] px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-16 text-[var(--text-primary)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestros Servicios
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            className="service-card text-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => handleServiceClick(service.title)}
                        >
                            <div className="text-[var(--accent-primary)] mb-5 inline-block">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">{service.title}</h3>
                            <p className="text-[var(--text-secondary)]">{service.description}</p>
                        </motion.div>
                    ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';

const PaymentPage = () => {
    const { toast } = useToast();
    const handleSelectPlan = (planName) => {
        toast({
          title: "🚧 Pago no implementado",
          description: `La selección del ${planName} no está activa. ¡Puedes solicitarla en tu próximo prompt! 🚀`
        });
    };
    
    const plans = [
        {
            name: "Básico",
            price: "29.99",
            features: ["100 Créditos", "Soporte por email", "Acceso a herramientas básicas"],
            popular: false,
        },
        {
            name: "Premium",
            price: "59.99",
            features: ["500 Créditos", "Soporte 24/7 prioritario", "Acceso a todas las herramientas", "Prioridad en el procesamiento"],
            popular: true,
        },
        {
            name: "Empresarial",
            price: "99.99",
            features: ["Créditos ilimitados", "Soporte dedicado", "API Access", "Funciones personalizadas"],
            popular: false,
        }
    ];

    return (
        <motion.div
            key="planes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 py-32"
        >
            <h2 className="text-4xl font-bold text-center mb-4">Planes y Precios</h2>
            <p className="text-center text-[var(--text-secondary)] mb-16">Elige el plan que mejor se adapte a tus necesidades.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        className={`service-card p-8 flex flex-col ${plan.popular ? 'border-2 border-[var(--accent-primary)]' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                Más Popular
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                        <p className="text-center mb-6 text-[var(--text-secondary)]">
                            <span className="text-4xl font-extrabold text-[var(--text-primary)]">${plan.price}</span>/mes
                        </p>
                        <ul className="space-y-4 mb-8 flex-grow">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="btn-primary w-full mt-auto" onClick={() => handleSelectPlan(plan.name)}>
                            Seleccionar Plan
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default PaymentPage;
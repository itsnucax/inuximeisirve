import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterPage = ({ setActiveTab }) => {
  const [form, setForm] = useState({ username: '', name: '', phone: '', email: '', password: '' });
  const { register, loading } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.phone || !form.email || !form.password) {
        toast({ title: 'Error', description: 'Todos los campos son obligatorios.', variant: 'destructive' });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        toast({ title: 'Error', description: 'Por favor, ingresa un email válido.', variant: 'destructive' });
        return;
    }

    const success = await register(form);
    if(success) {
        setActiveTab('login');
    }
  };

  return (
    <motion.div
      key="registro"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-8">Crear Cuenta</h2>
      
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Nombre Completo</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Tu nombre y apellido"
              value={form.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Teléfono</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Tu número de teléfono"
              value={form.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Usuario</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Elige un nombre de usuario"
              value={form.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Crea una contraseña segura"
              value={form.password}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <div className="loading-spinner"></div> : <><UserPlus className="w-5 h-5" /> Registrarse</>}
          </button>
        </form>
      </div>
      <p className="text-center mt-6 text-[var(--text-secondary)]">
        ¿Ya tienes cuenta?{' '}
        <button onClick={() => setActiveTab('login')} className="font-semibold text-[var(--accent-primary)] hover:underline">Inicia sesión</button>
      </p>
    </motion.div>
  );
};

export default RegisterPage;
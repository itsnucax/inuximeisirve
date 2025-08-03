import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = ({ setActiveTab }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      setActiveTab('inicio');
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-8">Iniciar Sesión</h2>
      
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Usuario</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <div className="loading-spinner"></div> : <><User className="w-5 h-5" /> Iniciar Sesión</>}
          </button>
        </form>
      </div>
      <p className="text-center mt-6 text-[var(--text-secondary)]">
        ¿No tienes cuenta?{' '}
        <button onClick={() => setActiveTab('registro')} className="font-semibold text-[var(--accent-primary)] hover:underline">Regístrate aquí</button>
      </p>
    </motion.div>
  );
};

export default LoginPage;
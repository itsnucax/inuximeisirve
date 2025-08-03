import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Gem, Edit, Trash2, User as UserIcon, Lock, List, Mail, Phone, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserPanel = () => {
  const { user, updateUserProfile, changePassword } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('registrations');

  const handleActionClick = (description) => {
    toast({
      title: "🚧 Función no implementada",
      description: `¡${description} no está implementada aún—pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀`
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'registrations':
        return <RegistrationsTable user={user} onActionClick={() => handleActionClick("Editar o eliminar registros")} />;
      case 'profile':
        return <ProfileSettings user={user} onUpdate={updateUserProfile} />;
      case 'password':
        return <PasswordSettings onChangePass={changePassword} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-32"
    >
      <h2 className="text-4xl font-bold text-center mb-4">Panel de Usuario</h2>
      <p className="text-center text-[var(--text-secondary)] mb-12">Hola, {user?.name || user?.username}. Aquí puedes gestionar tu cuenta.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl p-4 border border-[var(--border-color)]">
            <nav className="flex flex-col space-y-2">
              <button onClick={() => setActiveTab('registrations')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'registrations' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <List className="w-5 h-5"/> <span>Mis Registros</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <UserIcon className="w-5 h-5"/> <span>Editar Perfil</span>
              </button>
              <button onClick={() => setActiveTab('password')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'password' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <Lock className="w-5 h-5"/> <span>Cambiar Contraseña</span>
              </button>
            </nav>
          </div>
        </div>
        <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const RegistrationsTable = ({ user, onActionClick }) => (
    <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <div className="flex flex-wrap justify-between items-center mb-8 pb-4 border-b border-[var(--border-color)] gap-4">
          <h3 className="text-2xl font-bold">Mis Registros</h3>
          <div className="flex items-center gap-2 text-xl font-semibold bg-[var(--card-bg)] px-4 py-2 rounded-lg border border-[var(--border-color)]">
              <Gem className="w-6 h-6 text-[var(--accent-primary)]" />
              <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          {user?.registrations && user.registrations.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="p-3">ID Registro</th>
                  <th className="p-3">ECID / Serial</th>
                  <th className="p-3">Servicio</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {user.registrations.map(reg => (
                  <tr key={reg.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3 font-mono text-sm text-[var(--text-secondary)]">{reg.id}</td>
                    <td className="p-3 font-semibold">{reg.ecid}</td>
                    <td className="p-3">{reg.service}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{new Date(reg.date).toLocaleDateString()}</td>
                    <td className="p-3">
                        <div className="flex justify-center gap-4">
                            <button onClick={onActionClick} className="text-[var(--text-secondary)] hover:text-yellow-400 transition-colors"><Edit className="w-5 h-5"/></button>
                            <button onClick={onActionClick} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5"/></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-[var(--text-secondary)] py-10">No tienes registros todavía.</p>
          )}
        </div>
    </div>
);

const ProfileSettings = ({ user, onUpdate }) => {
    const [profile, setProfile] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });

    const handleChange = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(profile);
    }
    
    return (
    <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6">Editar Perfil</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Nombre Completo</label>
                <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                    <input type="text" name="name" className="form-input pl-10" value={profile.name} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Teléfono</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                    <input type="tel" name="phone" className="form-input pl-10" value={profile.phone} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Nombre de usuario</label>
                <div className="flex items-center gap-3 form-input bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-not-allowed">
                    <UserIcon className="w-5 h-5" />
                    <span>{user?.username} (no se puede cambiar)</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Correo electrónico</label>
                <div className="flex items-center gap-3 form-input bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-not-allowed">
                    <Mail className="w-5 h-5" />
                    <span>{user?.email} (no se puede cambiar)</span>
                </div>
            </div>
            <button type="submit" className="btn-primary">Guardar Cambios</button>
        </form>
    </div>
)};

const PasswordSettings = ({ onChangePass }) => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: ''});
    const { toast } = useToast();

    const handleChange = (e) => {
        setPasswords({...passwords, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(passwords.newPassword !== passwords.confirmPassword){
            toast({title: "Error", description: "Las nuevas contraseñas no coinciden.", variant: "destructive"});
            return;
        }
        if(passwords.newPassword.length < 6){
             toast({title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres.", variant: "destructive"});
            return;
        }

        const success = onChangePass(passwords.currentPassword, passwords.newPassword);
        if(success) {
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: ''});
        }
    }

    return (
    <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6">Cambiar Contraseña</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Contraseña Actual</label>
                <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handleChange} className="form-input" placeholder="********" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Nueva Contraseña</label>
                <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="form-input" placeholder="********" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Confirmar Nueva Contraseña</label>
                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="form-input" placeholder="********" />
            </div>
            <button type="submit" className="btn-primary">Actualizar Contraseña</button>
        </form>
    </div>
)};


export default UserPanel;
import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useAuth } from '@/contexts/AuthContext';
  import { Users, PlusCircle, Gem, UserPlus, History, List, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
  import { useToast } from '@/components/ui/use-toast';

  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const { user, isAdmin, addBalance, addAdmin } = useAuth();
    const { toast } = useToast();

    if (!isAdmin) {
      return <div className="max-w-7xl mx-auto px-4 py-32 text-center">No tienes permisos de administrador.</div>;
    }

    return (
      <motion.div
        key="admin"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-32"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Panel de Administración</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="md:w-1/4">
            <div className="glass-effect rounded-2xl p-4 border border-[var(--border-color)] space-y-2">
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <Users className="w-5 h-5"/> <span>Gestión de Usuarios</span>
              </button>
              <button onClick={() => setActiveTab('balance')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'balance' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <PlusCircle className="w-5 h-5"/> <span>Añadir Saldo</span>
              </button>
              <button onClick={() => setActiveTab('addAdmin')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'addAdmin' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <UserPlus className="w-5 h-5"/> <span>Añadir Admin</span>
              </button>
              <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-[var(--accent-primary)]/10'}`}>
                <History className="w-5 h-5"/> <span>Historial de Servicios</span>
              </button>
            </div>
          </nav>
          <main className="md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'users' && <UsersManagement />}
                {activeTab === 'balance' && <AddBalance />}
                {activeTab === 'addAdmin' && <AddAdmin />}
                {activeTab === 'history' && <ServiceHistory />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    );
  };

  const UsersManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://inuxteam.com/api/get_users.php');
          const data = await response.json();
          if (response.ok) {
            setUsers(data.users || []);
          } else {
            toast({ title: 'Error', description: 'No se pudieron cargar los usuarios.', variant: 'destructive' });
          }
        } catch (err) {
          toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
        }
      };
      fetchUsers();
    }, [toast]);

    return (
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Users className="w-7 h-7 text-[var(--accent-primary)]" /> Gestión de Usuarios</h3>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="p-3">Usuario</th>
                <th className="p-3">Email</th>
                <th className="p-3">Saldo</th>
                <th className="p-3">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3 font-semibold">{u.username}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{u.email}</td>
                    <td className="p-3 font-medium flex items-center gap-1.5"><Gem className="w-4 h-4 text-cyan-400"/> ${parseFloat(u.credits).toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-3 text-center text-[var(--text-secondary)]">No hay usuarios disponibles.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AddBalance = () => {
    const { addBalance } = useAuth();
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState('');
    const [balanceToAdd, setBalanceToAdd] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://inuxteam.com/api/get_users.php');
          const data = await response.json();
          if (response.ok) {
            setUsers(data.users || []);
          } else {
            toast({ title: 'Error', description: 'No se pudieron cargar los usuarios.', variant: 'destructive' });
          }
        } catch (err) {
          toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
        }
      };
      fetchUsers();
    }, [toast]);

    const handleAddBalance = (e) => {
      e.preventDefault();
      if (!selectedUser || !balanceToAdd) {
        toast({ title: 'Error', description: 'Por favor, selecciona un usuario y una cantidad.', variant: 'destructive' });
        return;
      }
      addBalance(selectedUser, balanceToAdd);
      setBalanceToAdd('');
    };

    return (
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><PlusCircle className="w-7 h-7 text-[var(--accent-primary)]" /> Añadir Saldo</h3>
        <form onSubmit={handleAddBalance} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Seleccionar Usuario</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="form-input">
              <option value="">-- Elige un usuario --</option>
              {users.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Cantidad ($)</label>
            <input type="number" min="0.01" step="0.01" className="form-input" placeholder="Ej: 100.00" value={balanceToAdd} onChange={(e) => setBalanceToAdd(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">Añadir Saldo</button>
        </form>
      </div>
    );
  };

  const AddAdmin = () => {
    const { addAdmin } = useAuth();
    const { toast } = useToast();
    const [adminData, setAdminData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => {
      setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const handleAddAdmin = async (e) => {
      e.preventDefault();
      if (!adminData.username || !adminData.email || !adminData.password) {
        toast({ title: 'Error', description: 'Todos los campos son obligatorios.', variant: 'destructive' });
        return;
      }
      if (adminData.password.length < 6) {
        toast({ title: 'Error', description: 'La contraseña debe tener al menos 6 caracteres.', variant: 'destructive' });
        return;
      }
      try {
        const response = await fetch('https://inuxteam.com/api/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: adminData.username, name: adminData.username, phone: '', email: adminData.email, password: adminData.password, role: 'admin' }),
        });
        const data = await response.json();
        if (response.ok) {
          toast({ title: 'Administrador Creado', description: `El usuario ${adminData.username} ahora es administrador.` });
          setAdminData({ username: '', email: '', password: '' });
        } else {
          toast({ title: 'Error', description: data.message, variant: 'destructive' });
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
      }
    };

    return (
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><UserPlus className="w-7 h-7 text-[var(--accent-primary)]" /> Añadir Administrador</h3>
        <form onSubmit={handleAddAdmin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Nombre de Usuario</label>
            <input type="text" name="username" value={adminData.username} onChange={handleChange} className="form-input" placeholder="nuevo_admin" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Correo Electrónico</label>
            <input type="email" name="email" value={adminData.email} onChange={handleChange} className="form-input" placeholder="admin@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Contraseña</label>
            <input type="password" name="password" value={adminData.password} onChange={handleChange} className="form-input" placeholder="********" />
          </div>
          <button type="submit" className="btn-primary w-full">Crear Administrador</button>
        </form>
      </div>
    );
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

  const ServiceHistory = () => {
    const { user } = useAuth();
    // Por ahora, usaremos solo el historial del usuario actual como placeholder
    const allServiceHistory = user?.dhru_orders || [];

    return (
      <div className="glass-effect rounded-2xl p-8 border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><History className="w-7 h-7 text-[var(--accent-primary)]" /> Historial de Servicios Global</h3>
        <div className="overflow-x-auto max-h-[500px]">
          {allServiceHistory.length > 0 ? (
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
                {allServiceHistory.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3 font-semibold">{user.username}</td>
                    <td className="p-3">{item.service}</td>
                    <td className="p-3 text-sm text-[var(--text-secondary)]">{new Date(item.date).toLocaleString()}</td>
                    <td className="p-3"><StatusBadge status={item.status} /></td>
                    <td className="p-3 text-right font-semibold">{item.cost || '$5.00'}</td>
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

  export default AdminPanel;
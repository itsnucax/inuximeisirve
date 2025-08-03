import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('inux_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const safeUserData = {
        id: userData.id || null,
        username: userData.username || '',
        role: userData.role || 'user',
        credits: parseFloat(userData.credits) || 0,
      };
      setUser(safeUserData);
      setIsLoggedIn(true);
      setIsAdmin(safeUserData.role === 'admin');
    }

    // Cargar servicios iniciales desde services.json
    const loadInitialServices = async () => {
      try {
        const response = await fetch('https://inuxteam.com/services.json');
        const data = await response.json();
        console.log('Datos cargados de services.json:', data); // Depuración
        if (data.SUCCESS && data.SUCCESS[0] && data.SUCCESS[0].LIST) {
          const serviceList = [];
          const categories = data.SUCCESS[0].LIST;
          console.log('Categorías en LIST:', Object.keys(categories)); // Depuración
          for (const category in categories) {
            if (categories[category].SERVICES) {
              const servicesInCategory = Object.values(categories[category].SERVICES)
                .filter(service => service.SERVICEID);
              serviceList.push(...servicesInCategory);
              console.log(`Servicios en ${category}:`, servicesInCategory); // Depuración
            }
          }
          console.log('Servicios procesados:', serviceList); // Depuración
          setServices(serviceList);
        } else {
          console.log('No se encontró LIST o SUCCESS[0] válido:', data.SUCCESS); // Depuración
          toast({ title: 'Error', description: 'La estructura de servicios no es válida.', variant: 'destructive' });
        }
      } catch (err) {
        console.error('Error al cargar servicios:', err); // Depuración
        toast({ title: 'Error', description: 'Error al cargar los servicios iniciales.', variant: 'destructive' });
      }
    };
    loadInitialServices();
  }, [toast]);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const userData = data.user;
        const safeUserData = {
          id: userData.id || null,
          username: userData.username || '',
          role: userData.role || 'user',
          credits: parseFloat(userData.credits) || 0,
        };
        setUser(safeUserData);
        setIsLoggedIn(true);
        setIsAdmin(safeUserData.role === 'admin');
        localStorage.setItem('inux_user', JSON.stringify(safeUserData));
        localStorage.setItem('inux_token', data.token);
        toast({ title: '¡Bienvenido de vuelta!', description: `Sesión iniciada como ${safeUserData.username}` });
        return true;
      } else {
        toast({ title: 'Error de inicio de sesión', description: data.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, name, phone, email, password }) => {
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, phone, email, password, role: 'user' }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: '¡Registro exitoso!', description: 'Ahora puedes iniciar sesión con tu nueva cuenta.' });
        return true;
      } else {
        toast({ title: 'Error de registro', description: data.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('inux_user');
    localStorage.removeItem('inux_token');
    toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
  };

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: profileData.name, phone: profileData.phone }),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, name: profileData.name, phone: profileData.phone };
        setUser(updatedUser);
        localStorage.setItem('inux_user', JSON.stringify(updatedUser));
        toast({ title: 'Perfil Actualizado', description: 'Tus datos han sido actualizados con éxito.' });
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return false;
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Contraseña Actualizada', description: 'Tu contraseña ha sido cambiada con éxito.' });
        return true;
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addBalance = async (targetUsername, amount) => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/add_balance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUsername, amount: parseFloat(amount) }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Éxito', description: `Se añadió un saldo de $${parseFloat(amount).toFixed(2)} a ${targetUsername}.` });
        if (user.username === targetUsername) {
          const updatedUser = { ...user, credits: parseFloat(user.credits) + parseFloat(amount) };
          setUser(updatedUser);
          localStorage.setItem('inux_user', JSON.stringify(updatedUser));
        }
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al conectar con el servidor.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://inuxteam.com/api/get_imeiservice_list.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'itsnucax',
          access_key: 'T94-7AQ-TZR-TBL-SDK-PAC-MX3-MZX',
        }),
      });
      if (!response.ok) throw new Error('Error en la API');
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        toast({ title: 'Error', description: 'Formato de respuesta no válido.', variant: 'destructive' });
        return;
      }
      const data = await response.json();
      if (data.SUCCESS && data.SUCCESS[0].LIST) {
        const serviceList = [];
        const categories = data.SUCCESS[0].LIST;
        for (const category in categories) {
          if (categories[category].SERVICES) {
            const servicesInCategory = Object.values(categories[category].SERVICES)
              .filter(service => service.SERVICEID);
            serviceList.push(...servicesInCategory);
          }
        }
        setServices(serviceList);
        toast({ title: 'Éxito', description: 'Servicios actualizados correctamente.' });
      }
    } catch (err) {
      console.error('Error updating services:', err);
      toast({ title: 'Error', description: 'Error al actualizar los servicios.', variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    services,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUserProfile,
    changePassword,
    addBalance,
    updateServices,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
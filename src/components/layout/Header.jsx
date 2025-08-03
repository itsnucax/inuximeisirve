import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Gem, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const DhruServicesDropdown = ({ onNavigate, setMobileMenuOpen }) => {
    const { isLoggedIn } = useAuth();
    
    const handleNavigation = (target) => {
        onNavigate(target);
        if (setMobileMenuOpen) setMobileMenuOpen(false);
    };

    return (
        <div className="relative group">
            <button className="nav-tab flex items-center gap-1">
                <span>Servicios DHRU</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 w-60 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10 pt-2 pb-2">
                 <a onClick={() => handleNavigation('imei')} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Registrar servicios de IMEI</a>
                 <a onClick={() => handleNavigation('server')} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Registrar servicios de servidor</a>
                 <a onClick={() => handleNavigation('rental')} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Renta de Herramientas</a>
                 <a onClick={() => handleNavigation('serial')} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Registrar serial</a>
                 {isLoggedIn && <a onClick={() => handleNavigation('historial')} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Historial de servicios de DHRU</a>}
            </div>
        </div>
    );
}

const Header = ({ activeTab, setActiveTab, isMobileMenuOpen, setMobileMenuOpen, handleDhruNavigation }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActiveTab('inicio');
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio', public: true },
    { id: 'dhru-services', label: 'Servicios DHRU', isDropdown: true },
    { id: 'caracteristicas', label: 'Características', public: true },
    { id: 'descargar', label: 'Descargar', public: true },
    { id: 'login', label: 'Login', hideWhenLoggedIn: true },
    { id: 'registro', label: 'Registro', hideWhenLoggedIn: true },
    { id: 'panel', label: 'Panel Usuario', requireAuth: true, adminOnly: false },
    { id: 'admin', label: 'Panel Admin', requireAuth: true, adminOnly: true },
  ].filter(item => {
    if (isLoggedIn) {
        if (item.hideWhenLoggedIn) return false;
        if (item.adminOnly && !isAdmin) return false;
        if (item.id === 'panel' && isAdmin) return false;
    } else {
        if (item.requireAuth) return false;
    }
    return true;
  });

  return (
    <header className="fixed top-[37px] left-0 right-0 z-40 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('inicio')}>
             <img  class="h-10 w-auto" alt="Inux Logo Placeholder" src="https://images.unsplash.com/photo-1683201681334-f25eb7658958" />
          </div>

          <nav className="hidden md:flex items-center space-x-2 relative">
            {navItems.map((item) => {
              if (item.isDropdown) {
                  return <DhruServicesDropdown key={item.id} onNavigate={handleDhruNavigation} />
              }
              return (
              <button
                key={item.id}
                className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            )})}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(168,85,247,0.1)] transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoggedIn && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center gap-2 text-sm font-semibold bg-[var(--card-bg)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
                    <Gem className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">Salir</button>
              </div>
            )}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative w-4/5 max-w-sm ml-auto h-full z-50 bg-[var(--bg-primary)] p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                 <img  class="h-10 w-auto" alt="Inux Logo Placeholder" src="https://images.unsplash.com/photo-1683201681334-f25eb7658958" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-7 h-7" />
                </button>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                    if (item.isDropdown) {
                        return (
                            <div key={item.id} className="text-left text-lg py-2">
                                <span className="font-semibold text-[var(--text-primary)]">{item.label}</span>
                                <div className="pl-4 mt-2 flex flex-col space-y-3">
                                    <button onClick={() => { handleDhruNavigation('imei'); setMobileMenuOpen(false); }} className="text-left text-[var(--text-secondary)]">Registrar servicios IMEI</button>
                                    <button onClick={() => { handleDhruNavigation('server'); setMobileMenuOpen(false); }} className="text-left text-[var(--text-secondary)]">Registrar servicios servidor</button>
                                    <button onClick={() => { handleDhruNavigation('rental'); setMobileMenuOpen(false); }} className="text-left text-[var(--text-secondary)]">Renta de Herramientas</button>
                                    <button onClick={() => { handleDhruNavigation('serial'); setMobileMenuOpen(false); }} className="text-left text-[var(--text-secondary)]">Registrar serial</button>
                                    {isLoggedIn && <button onClick={() => { handleDhruNavigation('historial'); setMobileMenuOpen(false); }} className="text-left text-[var(--text-secondary)]">Historial DHRU</button>}
                                </div>
                            </div>
                        )
                    }
                    return(
                  <button
                    key={item.id}
                    className="text-left text-lg py-3 text-[var(--text-primary)]"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                )})}
                {isLoggedIn && (
                  <>
                  <div className="border-t border-[var(--border-color)] my-4"></div>
                  <div className="flex items-center gap-2 text-lg py-3">
                      <Gem className="w-5 h-5 text-[var(--accent-primary)]" />
                      <span>${user?.credits ? user.credits.toFixed(2) : '0.00'}</span>
                  </div>
                   <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-lg py-3 text-red-500">
                      Salir
                  </button>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
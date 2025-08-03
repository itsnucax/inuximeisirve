import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';

import HomePage from '@/pages/HomePage';
import RegisterSerialPage from '@/pages/RegisterSerialPage';
import FeaturesPage from '@/pages/FeaturesPage';
import DownloadPage from '@/pages/DownloadPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminPanel from '@/pages/AdminPanel';
import UserPanel from '@/pages/UserPanel';
import DhruImeiPage from '@/pages/DhruImeiPage';
import DhruServerPage from '@/pages/DhruServerPage';
import DhruHistorialPage from '@/pages/DhruHistorialPage';
import ToolRentalPage from '@/pages/ToolRentalPage';
import { useToast } from '@/components/ui/use-toast';

const Main = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const { isLoggedIn, isAdmin } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleDhruNavigation = (target) => {
    if ((target === 'historial' || target === 'imei' || target === 'server' || target === 'serial' || target === 'rental') && !isLoggedIn) {
         toast({ title: 'Acceso Denegado', description: 'Debes iniciar sesión para acceder a esta sección.', variant: 'destructive' });
         return;
    }
    
    if (target === "imei") setActiveTab('dhru-imei');
    else if (target === "server") setActiveTab('dhru-server');
    else if (target === "serial") setActiveTab('registrar-serial');
    else if (target === "historial") setActiveTab('dhru-historial');
    else if (target === "rental") setActiveTab('dhru-rental');
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return <HomePage setActiveTab={setActiveTab} />;
      case 'registrar-serial': return isLoggedIn ? <RegisterSerialPage /> : <HomePage setActiveTab={setActiveTab} />;
      case 'caracteristicas': return <FeaturesPage />;
      case 'descargar': return <DownloadPage />;
      case 'login': return <LoginPage setActiveTab={setActiveTab} />;
      case 'registro': return <RegisterPage setActiveTab={setActiveTab} />;
      case 'admin': return isAdmin ? <AdminPanel /> : <HomePage setActiveTab={setActiveTab} />;
      case 'panel': return isLoggedIn ? <UserPanel /> : <HomePage setActiveTab={setActiveTab} />;
      case 'dhru-imei': return isLoggedIn ? <DhruImeiPage /> : <HomePage setActiveTab={setActiveTab} />;
      case 'dhru-server': return isLoggedIn ? <DhruServerPage /> : <HomePage setActiveTab={setActiveTab} />;
      case 'dhru-historial': return isLoggedIn ? <DhruHistorialPage /> : <HomePage setActiveTab={setActiveTab} />;
      case 'dhru-rental': return isLoggedIn ? <ToolRentalPage /> : <HomePage setActiveTab={setActiveTab} />;
      default: return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Inux Team Support - Soluciones 24/7</title>
        <meta name="description" content="Servicios profesionales de bypass FRP, iCloud y MDM. Soporte técnico especializado 24/7 para dispositivos Samsung, Xiaomi y Apple." />
      </Helmet>
      
      <Marquee />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} handleDhruNavigation={handleDhruNavigation} />
      
      <main className="flex-grow transition-filter duration-300">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Main;
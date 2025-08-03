import React from 'react';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { toast } = useToast();

  const handleLinkClick = () => {
    toast({
      title: "🚧 Página no implementada",
      description: "¡Esta característica no está implementada aún—pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] text-[var(--text-secondary)] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <span className="text-2xl font-bold text-[var(--text-primary)]">Inux Team Support</span>
            <p className="mt-4">Soluciones profesionales para dispositivos móviles. Soporte técnico especializado 24/7.</p>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block text-[var(--text-primary)]">Enlaces Rápidos</span>
            <div className="space-y-2">
              <button onClick={handleLinkClick} className="block w-full md:w-auto hover:text-[var(--accent-primary)] transition-colors">Términos de Servicio</button>
              <button onClick={handleLinkClick} className="block w-full md:w-auto hover:text-[var(--accent-primary)] transition-colors">Política de Privacidad</button>
              <button onClick={handleLinkClick} className="block w-full md:w-auto hover:text-[var(--accent-primary)] transition-colors">Contacto</button>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block text-[var(--text-primary)]">Contacto</span>
            <div className="space-y-2">
              <p>Email: support@inuxteam.com</p>
              <p>Teléfono: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border-color)] mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Inux Team Support. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
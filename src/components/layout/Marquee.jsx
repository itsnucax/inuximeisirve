import React from 'react';

const Marquee = () => {
  const infoItems = [
    "Bienvenido a Inux Team Support",
    "Soluciones FRP, KG/MDM, iCloud",
    "Soporte 24/7",
    "Nuevos servicios añadidos",
    "Planes de pago flexibles",
  ];
  
  const duplicatedItems = [...infoItems, ...infoItems];

  return (
    <div className="marquee-container fixed top-0 left-0 right-0 z-50">
      <div className="marquee-content">
        {duplicatedItems.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
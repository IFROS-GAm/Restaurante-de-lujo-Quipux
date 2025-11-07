import React from 'react';
import { Outlet } from 'react-router-dom';
import PanelNav from '../components/panel/PanelNav';

const UsuarioLayout = () => {
  const links = [
    { to: '/usuario/menu', label: 'Menú' },
    { to: '/usuario/especiales', label: 'Especiales' },
    { to: '/usuario/sedes', label: 'Sedes' },
    { to: '/usuario/reserva', label: 'Reservar' },
  ];

  return (
    <div className="page">
      <PanelNav title="Panel Usuario" links={links} />
      <div className="page__content">
        <Outlet />
      </div>
    </div>
  );
};

export default UsuarioLayout;
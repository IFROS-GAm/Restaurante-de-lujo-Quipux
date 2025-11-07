import React from 'react';
import { Outlet } from 'react-router-dom';
import PanelNav from '../components/panel/PanelNav';

const AdminLayout = () => {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/reservas', label: 'Reservas' },
    { to: '/admin/calendario', label: 'Calendario' },
    { to: '/admin/sedes', label: 'Sedes' },
    { to: '/admin/mesas', label: 'Mesas' },
    { to: '/admin/menu/categorias', label: 'Categorías' },
    { to: '/admin/menu/platos', label: 'Platos' },
  ];

  return (
    <div className="page">
      <PanelNav title="Panel Administrador" links={links} />
      <div className="page__content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Ir al inicio">
          <span className="brand__emblem">RL</span>
          <span className="brand__name">Restaurante de Lujo</span>
        </Link>
        <nav className="navbar__nav">
          <NavLink to="/" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Inicio</NavLink>
          <NavLink to="/usuario/menu" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Menú</NavLink>
          <NavLink to="/usuario/reserva" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Reservar</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Admin</NavLink>
          )}
          {user ? (
            <NavLink to="/usuario/perfil" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
              Perfil
            </NavLink>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Acceder</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
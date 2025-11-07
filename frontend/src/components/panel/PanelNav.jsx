import React from 'react';
import { NavLink } from 'react-router-dom';

const PanelNav = ({ title, links = [] }) => {
  return (
    <div className="panel-nav">
      <div className="container panel-nav__inner">
        <h2 className="panel-nav__title">{title}</h2>
        <nav className="panel-nav__links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `panel-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default PanelNav;
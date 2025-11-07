import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">© {new Date().getFullYear()} Restaurante de Lujo</p>
        <p className="footer__sub">Experiencias culinarias excepcionales</p>
      </div>
    </footer>
  );
};

export default Footer;
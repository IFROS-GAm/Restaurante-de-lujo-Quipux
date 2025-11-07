import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing">
      <div className="landing__inner">
        <section className="landing__hero">
          <div>
            <h1 className="landing__title">Experiencia gastronómica de lujo</h1>
            <p className="landing__subtitle">Reserva tu mesa, descubre nuestros menús exclusivos y vive una noche inolvidable.</p>
            <div className="landing__actions">
              <Link to="/usuario/reserva" className="btn-landing btn-landing--primary">Reservar ahora</Link>
              <Link to="/auth" className="btn-landing btn-landing--ghost">Acceder</Link>
            </div>
          </div>
          <div className="landing__art" aria-hidden="true" />
        </section>

        <section className="landing__features">
          <div className="feature-card">
            <h3 className="feature-card__title">Menú de autor</h3>
            <p className="feature-card__text">Creaciones únicas con ingredientes seleccionados y maridajes perfectos.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card__title">Reserva guiada</h3>
            <p className="feature-card__text">Elige sede, fecha y horario con una interfaz elegante y simple.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card__title">Experiencia premium</h3>
            <p className="feature-card__text">Atmósfera cuidada, servicio excepcional y atención personalizada.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
import React from 'react';
import SectionHeader from '../components/common/SectionHeader';

const ReservasPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Reservas"
        subtitle="Asegure su lugar para una velada inolvidable"
      />
      <form className="form">
        <div className="form__row">
          <div className="form__field">
            <label className="label">Fecha</label>
            <input type="date" className="input" />
          </div>
          <div className="form__field">
            <label className="label">Hora</label>
            <input type="time" className="input" />
          </div>
          <div className="form__field">
            <label className="label">Personas</label>
            <input type="number" min="1" max="12" className="input" placeholder="2" />
          </div>
        </div>
        <div className="form__row">
          <div className="form__field form__field--full">
            <label className="label">Preferencias</label>
            <input type="text" className="input" placeholder="Ej. mesa cerca de ventana" />
          </div>
        </div>
        <button type="button" className="btn btn--accent">Solicitar reserva</button>
      </form>
    </div>
  );
};

export default ReservasPage;
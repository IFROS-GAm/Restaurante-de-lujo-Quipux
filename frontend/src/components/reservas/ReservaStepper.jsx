import React from 'react';

const steps = ['Sede', 'Piso', 'Mesa', 'Horario'];

const ReservaStepper = ({ current = 0 }) => {
  return (
    <div className="stepper">
      {steps.map((s, idx) => (
        <div key={s} className={`step${idx <= current ? ' active' : ''}`}>
          <span className="step__index">{idx + 1}</span>
          <span className="step__label">{s}</span>
        </div>
      ))}
    </div>
  );
};

export default ReservaStepper;
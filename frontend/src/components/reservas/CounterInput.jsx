import React from 'react';

const CounterInput = ({ value, min = 1, max = 10, onChange }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="counter">
      <button type="button" className="counter__btn" onClick={dec} aria-label="Disminuir">−</button>
      <div className="counter__value" aria-live="polite">{value}</div>
      <button type="button" className="counter__btn" onClick={inc} aria-label="Aumentar">+</button>
    </div>
  );
};

export default CounterInput;
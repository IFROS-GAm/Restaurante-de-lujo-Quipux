import React from 'react';

const SedeCard = ({ sede, onSelect }) => {
  const imgSrc = sede.imagen || 'https://via.placeholder.com/400x250?text=Sede';
  return (
    <div className="card">
      <img className="card__image" src={imgSrc} alt={sede.nombre || 'Sede'} />
      <div className="card__content">
        <h3 className="card__title">{sede.nombre}</h3>
        <p className="card__text">{sede.direccion}</p>
        {Array.isArray(sede.pisos) && sede.pisos.length > 0 && (
          <p className="card__text">Pisos: {sede.pisos.join(', ')}</p>
        )}
        <button className="btn btn-primary" onClick={() => onSelect?.(sede)}>Elegir sede</button>
      </div>
    </div>
  );
};

export default SedeCard;
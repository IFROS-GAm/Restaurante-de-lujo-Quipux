import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';

const mesas = [
  { id: 'A1', capacidad: 2, estado: 'Disponible' },
  { id: 'A2', capacidad: 4, estado: 'Ocupada' },
  { id: 'B1', capacidad: 6, estado: 'Reservada' },
  { id: 'B2', capacidad: 2, estado: 'Disponible' },
  { id: 'C1', capacidad: 8, estado: 'Disponible' },
  { id: 'C2', capacidad: 4, estado: 'Ocupada' },
];

const EstadoTag = ({ estado }) => {
  const mapClass = {
    Disponible: 'tag tag--available',
    Ocupada: 'tag tag--occupied',
    Reservada: 'tag tag--reserved',
  };
  return <span className={mapClass[estado] || 'tag'}>{estado}</span>;
};

const MesasPage = () => {
  return (
    <div className="page">
      <SectionHeader title="Mesas" subtitle="Gestione la disponibilidad en tiempo real" />
      <div className="grid grid--3">
        {mesas.map((m) => (
          <Card
            key={m.id}
            title={`Mesa ${m.id}`}
            description={`Capacidad: ${m.capacidad} comensales`}
            footer={
              <div className="card__actions">
                <EstadoTag estado={m.estado} />
                <button className="btn">Detalles</button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MesasPage;
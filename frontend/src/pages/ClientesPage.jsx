import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';

const clientes = [
  { nombre: 'María Gómez', nivel: 'VIP', visitas: 12 },
  { nombre: 'Luis Fernández', nivel: 'Regular', visitas: 5 },
  { nombre: 'Ana Martínez', nivel: 'VIP', visitas: 20 },
  { nombre: 'Jorge Pérez', nivel: 'Regular', visitas: 3 },
];

const NivelTag = ({ nivel }) => (
  <span className={`tag ${nivel === 'VIP' ? 'tag--accent' : ''}`}>{nivel}</span>
);

const ClientesPage = () => {
  return (
    <div className="page">
      <SectionHeader title="Clientes" subtitle="Conozca a sus comensales habituales" />
      <div className="toolbar">
        <input className="input" placeholder="Buscar cliente" />
        <button className="btn">Añadir cliente</button>
      </div>
      <div className="grid grid--2">
        {clientes.map((c) => (
          <Card
            key={c.nombre}
            title={c.nombre}
            description={`Visitas: ${c.visitas}`}
            footer={<NivelTag nivel={c.nivel} />}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientesPage;
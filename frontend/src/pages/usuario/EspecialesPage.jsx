import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import { especiales as mockEspeciales } from '../../services/mockData';
import { api } from '../../services/apiService';

const EspecialesPage = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { items } = await api.get('/menu/especiales');
        // Mapear a estructura de Card simple
        const mapped = (items || []).map((i) => ({ imagen: i.imagen, titulo: i.titulo, descripcion: i.descripcion, precio: i.precio }));
        if (mapped.length) {
          setItems(mapped);
        } else {
          setItems([mockEspeciales.especialCasa, mockEspeciales.platoNoche]);
        }
      } catch (_err) {
        setItems([mockEspeciales.especialCasa, mockEspeciales.platoNoche]);
      }
    })();
  }, []);
  return (
    <div className="page">
      <SectionHeader title="Especiales" subtitle="Lo mejor de la casa y el plato de la noche" />
      <div className="grid grid-2">
        {items.map((item, idx) => (
          <Card key={idx} image={item.imagen} title={item.titulo} description={item.descripcion} price={`$${item.precio}`} />
        ))}
      </div>
    </div>
  );
};

export default EspecialesPage;
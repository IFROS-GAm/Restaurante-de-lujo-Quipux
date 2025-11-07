import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import SedeCard from '../../components/sedes/SedeCard';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiService';

const SedesPage = () => {
  const [seleccion, setSeleccion] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSelect = (sede) => {
    setSeleccion(sede);
    navigate(`/usuario/reserva?sede=${sede.id}`);
  };

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const { items } = await api.get('/sedes');
        setItems(items || []);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las sedes');
      }
    })();
  }, []);

  return (
    <div className="page">
      <SectionHeader title="Sedes" subtitle="Elige dónde quieres vivir la experiencia" />
      <div className="card-grid">
        {items.map((sede) => (
          <SedeCard key={sede.id} sede={sede} onSelect={onSelect} />
        ))}
        {items.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card__content">
              <p className="muted">{error || 'Cargando sedes...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SedesPage;
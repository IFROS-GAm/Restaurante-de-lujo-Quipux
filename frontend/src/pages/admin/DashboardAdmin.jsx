import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const DashboardAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { items } = await api.get('/reservas');
        setItems(items || []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { hoyCount, semanaCount, totalCount } = useMemo(() => {
    const hoyStr = new Date().toISOString().slice(0, 10);
    const semanaLimite = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    let hoy = 0, semana = 0;
    for (const r of items || []) {
      if (!r?.fecha) continue;
      const d = new Date(r.fecha);
      if (r.fecha === hoyStr) hoy++;
      if (d <= semanaLimite) semana++;
    }
    return { hoyCount: hoy, semanaCount: semana, totalCount: (items || []).length };
  }, [items]);

  return (
    <div className="page admin-light">
      <SectionHeader title="Dashboard" subtitle="Resumen de reservas" />
      <div className="grid grid-3">
        <div className="metric">
          <div className="metric__value">{loading ? '...' : hoyCount}</div>
          <div className="metric__label">Reservas de hoy</div>
        </div>
        <div className="metric">
          <div className="metric__value">{loading ? '...' : semanaCount}</div>
          <div className="metric__label">Reservas próximos 7 días</div>
        </div>
        <div className="metric">
          <div className="metric__value">{loading ? '...' : totalCount}</div>
          <div className="metric__label">Total registradas</div>
        </div>
      </div>
      {error && <p className="muted" style={{ marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default DashboardAdmin;
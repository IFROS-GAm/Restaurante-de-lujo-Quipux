import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const rangos = {
  hoy: 1,
  semana: 7,
  mes: 30,
};

const CalendarioAdmin = () => {
  const [vista, setVista] = useState('semana');
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
        setError(err.message || 'No se pudo cargar el calendario');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hoy = new Date();
  const hasta = new Date(hoy.getTime() + rangos[vista] * 24 * 60 * 60 * 1000);
  const hastaISO = hasta.toISOString().slice(0, 10);

  const agrupadas = useMemo(() => {
    const bucket = {};
    (items || [])
      .filter(r => r.fecha && r.fecha <= hastaISO)
      .forEach(r => {
        bucket[r.fecha] = bucket[r.fecha] || [];
        bucket[r.fecha].push(r);
      });
    return bucket;
  }, [vista, items, hastaISO]);

  const fechas = Object.keys(agrupadas).sort();

  return (
    <div className="page">
      <SectionHeader title="Calendario" subtitle={`Citas: ${vista}`} />
      <div className="tabs">
        {Object.keys(rangos).map(k => (
          <button key={k} className={`tab${vista === k ? ' active' : ''}`} onClick={() => setVista(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="calendar">
        {loading && <p className="muted">Cargando reservas...</p>}
        {!loading && fechas.map((f) => (
          <div key={f} className="calendar__day">
            <div className="calendar__date">{f}</div>
            <div className="calendar__items">
              {agrupadas[f].map((r) => (
                <div key={r.id} className="calendar__item">
                  <span className="calendar__time">{r.hora}</span>
                  <span className="calendar__desc">{r.user_name || 'Cliente'} — {String(r.sede).toUpperCase()} Piso {r.piso} Mesa {r.mesa}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!loading && fechas.length === 0 && <p className="muted">No hay reservas en este rango.</p>}
        {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
      </div>
    </div>
  );
};

export default CalendarioAdmin;
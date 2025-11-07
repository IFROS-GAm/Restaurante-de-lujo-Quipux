import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const ReservasAdmin = () => {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroSede, setFiltroSede] = useState('');
  const [sedes, setSedes] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editEstado, setEditEstado] = useState('pendiente');
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams({ fecha: filtroFecha || '', sede: filtroSede || '' });
      const { items } = await api.get(`/reservas?${qs}`);
      setItems(items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const loadSedes = async () => {
    try {
      const { items } = await api.get('/sedes');
      setSedes(items || []);
      if (!filtroSede && items?.length) setFiltroSede('');
    } catch (_) {
      // sin bloqueo
    }
  };

  useEffect(() => { loadSedes(); }, []);
  useEffect(() => { load(); }, [filtroFecha, filtroSede]);

  const lista = useMemo(() => items, [items]);

  const estadoOptions = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  const estadoClass = (e) => {
    const x = String(e || '').toLowerCase();
    if (x === 'confirmada') return 'tag tag--confirmed';
    if (x === 'cancelada') return 'tag tag--cancelled';
    if (x === 'completada') return 'tag tag--completed';
    return 'tag tag--pending';
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditEstado(r.estado || 'pendiente');
  };
  const cancelEdit = () => { setEditingId(null); setEditEstado('pendiente'); };
  const saveEdit = async (id) => {
    try {
      setSavingId(id);
      const { ok, reserva } = await api.put(`/reservas/${id}`, { estado: editEstado });
      if (ok && reserva) {
        setItems((prev) => prev.map((it) => it.id === id ? { ...it, estado: reserva.estado } : it));
        setEditingId(null);
      }
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page admin-light">
      <SectionHeader title="Reservas" subtitle="Quién agendó, cuándo y dónde" />
      <div className="filters card" style={{ alignItems: 'center' }}>
        <div className="card__content" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label>
            <span className="label">Fecha</span>
            <input className="input" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} placeholder="dd/mm/aaaa" />
          </label>
          <label>
            <span className="label">Sede</span>
            <select className="input" value={filtroSede} onChange={(e) => setFiltroSede(e.target.value)}>
              <option value="">Todas</option>
              {(sedes || []).map((s) => (
                <option key={s.id} value={s.id}>{s.nombre || s.id}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="table">
        <div className="table__head" style={{ gridTemplateColumns: '1.4fr 1fr 0.9fr 0.6fr 0.8fr 0.6fr 1fr 0.8fr 0.8fr 0.9fr' }}>
          <div>Cliente</div>
          <div>Teléfono</div>
          <div>Sede</div>
          <div>Piso</div>
          <div>Mesa</div>
          <div>Personas</div>
          <div>Fecha</div>
          <div>Hora</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>
        {loading && <div className="table__row" style={{ gridTemplateColumns: '1.4fr 1fr 0.9fr 0.6fr 0.8fr 0.6fr 1fr 0.8fr 0.8fr 0.9fr' }}>Cargando...</div>}
        {!loading && lista.map((r) => (
          <div key={r.id} className="table__row" style={{ gridTemplateColumns: '1.4fr 1fr 0.9fr 0.6fr 0.8fr 0.6fr 1fr 0.8fr 0.8fr 0.9fr' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{r.user_name || '—'}</div>
              <div className="muted" style={{ fontSize: 12 }}>ID {r.user_id}</div>
            </div>
            <div>{r.user_phone || '—'}</div>
            <div>{r.sede}</div>
            <div>{r.piso}</div>
            <div>{r.mesa}</div>
            <div>{r.personas}</div>
            <div>{r.fecha}</div>
            <div>{r.hora}</div>
            <div>
              {editingId === r.id ? (
                <select className="input" value={editEstado} onChange={(e) => setEditEstado(e.target.value)}>
                  {estadoOptions.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : (
                <span className={estadoClass(r.estado)}>{r.estado || 'pendiente'}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editingId === r.id ? (
                <>
                  <button className="btn btn-primary" disabled={savingId === r.id} onClick={() => saveEdit(r.id)}>
                    {savingId === r.id ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className="btn" onClick={cancelEdit}>Cancelar</button>
                </>
              ) : (
                <button className="btn" onClick={() => startEdit(r)}>Editar</button>
              )}
            </div>
          </div>
        ))}
        {!loading && lista.length === 0 && (
          <div className="table__empty">No hay reservas con esos filtros.</div>
        )}
      </div>
      {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
    </div>
  );
};

export default ReservasAdmin;
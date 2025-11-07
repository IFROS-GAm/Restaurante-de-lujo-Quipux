import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import ReservaStepper from '../../components/reservas/ReservaStepper';
import TimeSlots from '../../components/reservas/TimeSlots';
import DatePickerInput from '../../components/reservas/DatePickerInput';
import CounterInput from '../../components/reservas/CounterInput';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/apiService';

const Paso = ({ title, children }) => (
  <div className="reserva-paso">
    <h3 className="section-title">{title}</h3>
    <div className="reserva-paso__content">{children}</div>
  </div>
);

const ReservaGuiadaPage = () => {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const preSede = params.get('sede');

  const [sedeId, setSedeId] = useState(preSede || '');
  const [sedes, setSedes] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [piso, setPiso] = useState('');
  const [mesaId, setMesaId] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState('20:00');
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  // Cargar nombre automáticamente desde el usuario autenticado
  useEffect(() => {
    if (user?.name) {
      setNombre(user.name);
    }
  }, [user]);

  const sedeActual = useMemo(() => sedes.find(s => s.id === sedeId), [sedes, sedeId]);

  // Cargar sedes al iniciar
  useEffect(() => {
    (async () => {
      try {
        setError('');
        const { items } = await api.get('/sedes');
        setSedes(items || []);
        if (!sedeId) {
          const first = items?.[0]?.id || '';
          if (first) setSedeId(first);
        }
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las sedes');
      }
    })();
  }, []);

  // Cargar pisos cuando cambia la sede
  useEffect(() => {
    (async () => {
      if (!sedeId) return;
      try {
        setError('');
        const { items } = await api.get(`/mesas/pisos?sede=${encodeURIComponent(sedeId)}`);
        setPisos(items || []);
        const firstNivel = items?.[0]?.nivel || '';
        setPiso(firstNivel ? String(firstNivel) : '');
        setMesaId('');
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los pisos');
        setPisos([]);
        setPiso('');
      }
    })();
  }, [sedeId]);

  // Cargar mesas cuando hay sede, piso, fecha y hora para correlacionar estados
  useEffect(() => {
    (async () => {
      if (!sedeId || !piso || !fecha || !hora) return;
      try {
        setError('');
        const qs = new URLSearchParams({ sede: sedeId, piso, fecha, hora }).toString();
        const { items } = await api.get(`/mesas?${qs}`);
        setMesas(items || []);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las mesas');
        setMesas([]);
      }
    })();
  }, [sedeId, piso, fecha, hora]);

  const confirmar = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    if (!user) {
      setSaveMsg('Necesitas iniciar sesión para reservar.');
      navigate('/auth');
      return;
    }
    if (!sedeId || !piso || !mesaId || !fecha || !hora) {
      setSaveMsg('Completa todos los pasos para confirmar la reserva.');
      return;
    }
    const mesaSel = mesas.find(m => m.id === mesaId);
    if (mesaSel && personas > mesaSel.capacidad) {
      setSaveMsg(`La mesa seleccionada tiene capacidad ${mesaSel.capacidad}. Reduce personas o elige otra mesa.`);
      return;
    }
    try {
      setSaving(true);
      const payload = { sede: sedeId, piso, mesa: mesaId, personas, fecha, hora };
      const { ok } = await api.post('/reservas', payload);
      if (ok) {
        setSaveMsg('Reserva creada correctamente');
        navigate('/usuario/perfil');
      } else {
        setSaveMsg('No se pudo crear la reserva');
      }
    } catch (err) {
      setSaveMsg(err.message || 'Error al crear la reserva');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <SectionHeader title="Reserva guiada" subtitle="Elige sede, piso, mesa y horario" />
      <ReservaStepper current={!sedeId ? 0 : !piso ? 1 : !mesaId ? 2 : 3} />

      <Paso title="1. Elige la sede">
        <div className="grid grid-2">
          {sedes.map((s) => (
            <label key={s.id} className={`option-card${sedeId === s.id ? ' selected' : ''}`}>
              <input type="radio" name="sede" value={s.id} checked={sedeId === s.id} onChange={() => setSedeId(s.id)} />
              <span className="option-card__title">{s.nombre}</span>
              <span className="option-card__sub">{s.direccion}</span>
            </label>
          ))}
          {sedes.length === 0 && (
            <p className="muted">{error || 'Cargando sedes...'}</p>
          )}
        </div>
      </Paso>

      <Paso title="2. Selecciona el piso">
        <div className="grid grid-2">
          {pisos.map((p) => (
            <label key={p.nivel} className={`option-card${piso === String(p.nivel) ? ' selected' : ''}`}>
              <input type="radio" name="piso" value={p.nivel} checked={piso === String(p.nivel)} onChange={() => setPiso(String(p.nivel))} />
              <span className="option-card__title">Piso {p.nivel}</span>
            </label>
          ))}
          {pisos.length === 0 && (
            <p className="muted">{sedeId ? (error || 'Cargando pisos...') : 'Selecciona una sede'}</p>
          )}
        </div>
      </Paso>

  <Paso title="3. Elige la mesa">
        <div className="grid grid-3">
          {mesas.map((m) => (
            <div key={m.id} className={`card${(m.estado && m.estado !== 'libre') ? ' disabled' : ''}${mesaId === m.id ? ' selected' : ''}`}>
              <div className="card__content">
                <div className="card__header">
                  <h4 className="card__title">Mesa {m.id}</h4>
                  <span className={`tag ${m.estado === 'libre' ? 'tag--available' : 'tag--occupied'}`}>
                    {m.estado === 'libre' ? 'Disponible' : 'Ocupada'}
                  </span>
                </div>
                <p className="card__text">Capacidad: {m.capacidad} personas</p>
                <div className="card__footer">
                  <span className="muted">{mesaId === m.id ? 'Seleccionada' : ''}</span>
                  <button className="btn btn-primary" disabled={m.estado && m.estado !== 'libre'} onClick={() => setMesaId(m.id)}>
                    {mesaId === m.id ? 'Seleccionada' : 'Seleccionar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {mesas.length === 0 && (
            <p className="muted">{piso ? (error || 'Cargando mesas...') : 'Selecciona sede y piso para ver mesas disponibles.'}</p>
          )}
        </div>
      </Paso>

      <Paso title="4. Fecha, hora y personas">
        <form className="form-grid" onSubmit={confirmar}>
          {/* Nombre del usuario se toma automáticamente del perfil */}
          <label>
            Fecha
            <DatePickerInput value={fecha} onChange={setFecha} />
          </label>

          <div className="form-grid__timeslots">
            <div className="label">Hora</div>
            <TimeSlots dateISO={fecha} value={hora} onChange={setHora} start="18:00" end="23:00" stepMinutes={30} />
          </div>

          <label>
            Personas
            <CounterInput value={personas} min={1} max={10} onChange={setPersonas} />
          </label>

          {mesaId && (
            <div className="summary card">
              <div className="card__content">
                <h4 className="card__title">Resumen</h4>
                <p className="card__text">Sede: {sedeActual?.nombre || sedeId?.toUpperCase()}</p>
                <p className="card__text">Piso: {piso}</p>
                <p className="card__text">Mesa: {mesaId}</p>
                <p className="card__text">Fecha: {fecha} — Hora: {hora}</p>
                <p className="card__text">Personas: {personas}</p>
              </div>
            </div>
          )}

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Confirmando...' : 'Confirmar reserva'}</button>
            {saveMsg && <p className="muted" style={{ marginTop: 8 }}>{saveMsg}</p>}
          </div>
        </form>
      </Paso>
    </div>
  );
};

export default ReservaGuiadaPage;
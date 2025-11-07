import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const MesasAdmin = () => {
  const [sedes, setSedes] = useState([]);
  const [sedeSel, setSedeSel] = useState('');
  const [pisos, setPisos] = useState([]);
  const [pisoSel, setPisoSel] = useState('');
  const [mesas, setMesas] = useState([]);
  const [error, setError] = useState('');

  const [pisoForm, setPisoForm] = useState('');
  const [mesaForm, setMesaForm] = useState({ id: '', capacidad: 2 });

  const loadSedes = async () => {
    try {
      const { items } = await api.get('/sedes');
      setSedes(items || []);
      if (!sedeSel && items?.length) setSedeSel(items[0]?.id || '');
    } catch (err) {
      setError(err.message || 'Error al cargar sedes');
    }
  };

  const loadPisos = async () => {
    if (!sedeSel) return;
    try {
      const { items } = await api.get(`/mesas/pisos?sede=${encodeURIComponent(sedeSel)}`);
      setPisos(items || []);
      if (!pisoSel && items?.length) setPisoSel(items[0]?.nivel || '');
    } catch (err) {
      setError(err.message || 'Error al cargar pisos');
    }
  };

  const loadMesas = async () => {
    if (!sedeSel) return;
    try {
      const qs = new URLSearchParams({ sede: sedeSel, piso: pisoSel || '' }).toString();
      const { items } = await api.get(`/mesas?${qs}`);
      setMesas(items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar mesas');
    }
  };

  useEffect(() => { loadSedes(); }, []);
  useEffect(() => { loadPisos(); }, [sedeSel]);
  useEffect(() => { loadMesas(); }, [sedeSel, pisoSel]);

  const addMesa = async (e) => {
    e.preventDefault();
    setError('');
    if (!sedeSel || !pisoForm || !mesaForm.id) return;
    const pisoNum = Number(pisoForm);
    if (Number.isNaN(pisoNum) || pisoNum < 1) {
      setError('Ingresa un número de piso válido (>= 1).');
      return;
    }
    if (pisoNum > maxPis) {
      setError(`El número de piso no puede exceder ${maxPis} para esta sede.`);
      return;
    }
    try {
      await api.post('/mesas', { id: mesaForm.id, sede: sedeSel, piso: String(pisoNum), capacidad: mesaForm.capacidad });
      setMesaForm({ id: '', capacidad: 2 });
      setPisoForm('');
      await loadMesas();
    } catch (err) {
      setError(err.message || 'No se pudo crear la mesa');
    }
  };

  const deleteMesa = async (id) => {
    setError('');
    try {
      await api.del(`/mesas/${id}`);
      await loadMesas();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la mesa');
    }
  };

  const pisosOptions = useMemo(() => (pisos || []).map((p) => p.nivel), [pisos]);
  const currentSede = useMemo(() => sedes.find((s) => s.id === sedeSel), [sedes, sedeSel]);
  const maxPis = useMemo(() => {
    const nums = (pisosOptions || []).map((x) => Number(x)).filter((n) => !Number.isNaN(n));
    if (nums.length > 0) return Math.max(...nums);
    const cp = Number(currentSede?.cantidad_pisos);
    if (Number.isInteger(cp) && cp > 0) return cp;
    return 1;
  }, [pisosOptions, currentSede]);

  return (
    <div className="page admin-light">
      <SectionHeader title="Mesas" subtitle="Crear y administrar mesas" />

      <div className="form" style={{ marginBottom: 16 }}>
        <div className="form__row">
          <div className="form__field">
            <label className="label">Sede</label>
            <select className="input" value={sedeSel} onChange={(e) => setSedeSel(e.target.value)}>
              {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="form__field">
            <label className="label">Piso</label>
            <select className="input" value={pisoSel} onChange={(e) => setPisoSel(e.target.value)}>
              <option value="">Todos</option>
              {pisosOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>


      <form className="form" onSubmit={addMesa} style={{ marginBottom: 16 }}>
        <div className="form__row" style={{ gap: 10 }}>
          <div className="form__field">
            <label className="label">Sede</label>
            <select className="input" value={sedeSel} onChange={(e) => setSedeSel(e.target.value)}>
              {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="form__field">
            <label className="label">Piso (número)</label>
            <input type="number" min={1} max={maxPis} className="input" value={pisoForm} onChange={(e) => setPisoForm(e.target.value)} placeholder="Ej. 1" />
            <div className="muted" style={{ marginTop: 4 }}>Máximo para esta sede: {maxPis}</div>
          </div>
          <div className="form__field">
            <label className="label">ID Mesa</label>
            <input className="input" value={mesaForm.id} onChange={(e) => setMesaForm({ ...mesaForm, id: e.target.value })} placeholder="Ej. C1-01" />
          </div>
          <div className="form__field">
            <label className="label">Capacidad</label>
            <input type="number" min="1" className="input" value={mesaForm.capacidad} onChange={(e) => setMesaForm({ ...mesaForm, capacidad: Number(e.target.value) })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Agregar mesa</button>
        {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
      </form>

      <div className="table">
        <div className="table__head">
          <div>ID</div>
          <div>Piso</div>
          <div>Capacidad</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>
        {mesas.map((m) => (
          <MesaRow key={m.id} mesa={m} sede={sedeSel} onDelete={deleteMesa} onUpdated={loadMesas} pisos={pisosOptions} />
        ))}
        {mesas.length === 0 && (
          <div className="table__empty">No hay mesas para la selección.</div>
        )}
      </div>
    </div>
  );
};

const MesaRow = ({ mesa, sede, pisos, onDelete, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ piso: mesa.piso || '', capacidad: mesa.capacidad || 2, estado: mesa.estado || 'libre' });

  const save = async () => {
    try {
      await api.put(`/mesas/${mesa.id}`, { sede, piso: String(editForm.piso), capacidad: Number(editForm.capacidad), estado: editForm.estado });
      setEditing(false);
      await onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="table__row">
      <div>{mesa.id}</div>
      <div>
        {editing ? (
          <select className="input" value={editForm.piso} onChange={(e) => setEditForm({ ...editForm, piso: e.target.value })}>
            {pisos.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        ) : (
          mesa.piso
        )}
      </div>
      <div>
        {editing ? (
          <input type="number" min="1" className="input" value={editForm.capacidad} onChange={(e) => setEditForm({ ...editForm, capacidad: e.target.value })} />
        ) : (
          mesa.capacidad
        )}
      </div>
      <div>
        {editing ? (
          <select className="input" value={editForm.estado} onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}>
            <option value="libre">libre</option>
            <option value="ocupada">ocupada</option>
            <option value="reservada">reservada</option>
          </select>
        ) : (
          <span className={`tag ${mesa.estado === 'libre' ? 'tag--available' : 'tag--occupied'}`}>{mesa.estado}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {editing ? (
          <>
            <button className="btn btn-primary" onClick={save}>Guardar</button>
            <button className="btn" onClick={() => setEditing(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => setEditing(true)}>Editar</button>
            <button className="btn btn-danger" onClick={() => onDelete(mesa.id)}>Eliminar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MesasAdmin;
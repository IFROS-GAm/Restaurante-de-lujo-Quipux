import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const SedesAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', nombre: '', direccion: '', cantidad_pisos: 1 });

  const load = async () => {
    try {
      setLoading(true);
      const { items } = await api.get('/sedes');
      setItems(items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar sedes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/sedes', { ...form, cantidad_pisos: Number(form.cantidad_pisos) });
      setForm({ id: '', nombre: '', direccion: '', cantidad_pisos: 1 });
      await load();
    } catch (err) {
      setError(err.message || 'No se pudo crear la sede');
    }
  };

  const onDelete = async (id) => {
    setError('');
    try {
      await api.del(`/sedes/${id}`);
      await load();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la sede');
    }
  };

  return (
    <div className="page admin-light">
      <SectionHeader title="Sedes" subtitle="Administrar ubicaciones del restaurante" />

      <form className="form" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
        <div className="form__row">
          <div className="form__field">
            <label className="label">ID</label>
            <input className="input" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="centro, norte..." />
          </div>
          <div className="form__field">
            <label className="label">Nombre</label>
            <input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Sede Centro" />
          </div>
          <div className="form__field">
            <label className="label">Dirección</label>
            <input className="input" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Calle 123 #45" />
          </div>
          <div className="form__field">
            <label className="label">Cantidad de pisos</label>
            <input type="number" min="1" className="input" value={form.cantidad_pisos} onChange={(e) => setForm({ ...form, cantidad_pisos: Number(e.target.value) })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Crear sede</button>
        {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
      </form>

      <div className="table">
        <div className="table__head">
          <div>ID</div>
          <div>Nombre</div>
          <div>Dirección</div>
          <div>Pisos</div>
          <div>Acciones</div>
        </div>
        {loading && <div className="table__row">Cargando...</div>}
        {!loading && items.map((s) => (
          <Row key={s.id} sede={s} onDelete={onDelete} onUpdated={load} />
        ))}
        {!loading && items.length === 0 && (
          <div className="table__empty">No hay sedes registradas.</div>
        )}
      </div>
    </div>
  );
};

const Row = ({ sede, onDelete, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nombre: sede.nombre || '', direccion: sede.direccion || '', cantidad_pisos: sede.cantidad_pisos || '' });

  const save = async () => {
    try {
      await api.put(`/sedes/${sede.id}`, { nombre: editForm.nombre, direccion: editForm.direccion, cantidad_pisos: Number(editForm.cantidad_pisos) || undefined });
      setEditing(false);
      await onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const pisosDisplay = () => {
    const v = typeof sede.cantidad_pisos === 'number' && sede.cantidad_pisos > 0
      ? sede.cantidad_pisos
      : Array.isArray(sede.pisos)
        ? sede.pisos.length
        : '-';
    return v;
  };

  return (
    <div className="table__row">
      <div>{sede.id}</div>
      <div>
        {editing ? (
          <input className="input" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
        ) : (
          sede.nombre
        )}
      </div>
      <div>
        {editing ? (
          <input className="input" value={editForm.direccion} onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })} />
        ) : (
          sede.direccion || '-'
        )}
      </div>
      <div>
        {editing ? (
          <input type="number" min="1" className="input" value={editForm.cantidad_pisos} onChange={(e) => setEditForm({ ...editForm, cantidad_pisos: e.target.value })} />
        ) : (
          pisosDisplay()
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
            <button className="btn btn-danger" onClick={() => onDelete(sede.id)}>Eliminar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SedesAdmin;
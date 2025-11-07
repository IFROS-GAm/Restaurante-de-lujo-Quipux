import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', nombre: '', orden: 99 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', orden: 99 });

  const loadCats = async () => {
    try {
      setLoading(true);
      const { categorias } = await api.get('/menu/categorias');
      setCategorias(categorias || []);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCats(); }, []);

  const createCat = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/menu/categorias', catForm);
      setCatForm({ id: '', nombre: '', orden: 99 });
      await loadCats();
    } catch (err) {
      setError(err.message || 'No se pudo crear la categoría');
    }
  };

  const deleteCat = async (id) => {
    setError('');
    try {
      await api.del(`/menu/categorias/${id}`);
      await loadCats();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la categoría');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({ nombre: cat.nombre || '', orden: cat.orden ?? 99 });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setError('');
    try {
      const payload = { nombre: editForm.nombre, orden: Number(editForm.orden) };
      await api.put(`/menu/categorias/${editingId}`, payload);
      setEditingId(null);
      await loadCats();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la categoría');
    }
  };

  return (
    <div className="page admin-light">
      <SectionHeader title="Categorías del Menú" subtitle="Crear y administrar categorías" />

      <form className="form" onSubmit={createCat} style={{ marginBottom: 16 }}>
        <div className="form__row">
          <div className="form__field">
            <label className="label">ID Categoría</label>
            <input className="input" value={catForm.id} onChange={(e) => setCatForm({ ...catForm, id: e.target.value })} placeholder="entradas, fuertes..." />
          </div>
          <div className="form__field">
            <label className="label">Nombre</label>
            <input className="input" value={catForm.nombre} onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value })} placeholder="Entradas" />
          </div>
          <div className="form__field">
            <label className="label">Orden</label>
            <input type="number" className="input" value={catForm.orden} onChange={(e) => setCatForm({ ...catForm, orden: Number(e.target.value) })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Crear categoría</button>
        {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
      </form>

      <div className="table">
        <div className="table__head">
          <div>ID</div>
          <div>Nombre</div>
          <div>Orden</div>
          <div>Acciones</div>
        </div>
        {loading && <div className="table__row">Cargando...</div>}
        {!loading && categorias.map((c) => (
          <div key={c.id} className="table__row">
            <div>{c.id}</div>
            <div>
              {editingId === c.id ? (
                <input
                  className="input"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                />
              ) : (
                c.nombre
              )}
            </div>
            <div>
              {editingId === c.id ? (
                <input
                  type="number"
                  className="input"
                  value={editForm.orden}
                  onChange={(e) => setEditForm({ ...editForm, orden: e.target.value })}
                />
              ) : (
                c.orden
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editingId === c.id ? (
                <>
                  <button className="btn btn-primary" onClick={saveEdit}>Guardar</button>
                  <button className="btn" onClick={cancelEdit}>Cancelar</button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={() => startEdit(c)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteCat(c.id)}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
        {!loading && categorias.length === 0 && (
          <div className="table__empty">No hay categorías registradas.</div>
        )}
      </div>
    </div>
  );
};

export default CategoriasAdmin;
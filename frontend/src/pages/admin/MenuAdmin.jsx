import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { api } from '../../services/apiService';

const MenuAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [catForm, setCatForm] = useState({ id: '', nombre: '', orden: 99 });
  const [itemForm, setItemForm] = useState({ titulo: '', precio: '', categoria: '', especial_de_la_casa: false, plato_de_la_noche: false });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: '', precio: '', categoria: '' });

  const loadCats = async () => {
    try {
      const { categorias } = await api.get('/menu/categorias');
      setCategorias(categorias || []);
      if (!itemForm.categoria && categorias?.length) {
        setItemForm((f) => ({ ...f, categoria: categorias[0]?.id || '' }));
      }
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    }
  };

  const loadItems = async () => {
    try {
      const { items } = await api.get('/menu');
      setItems(items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar menú');
    }
  };

  useEffect(() => { loadCats(); loadItems(); }, []);

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

  const createItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...itemForm, precio: Number(itemForm.precio) };
      await api.post('/menu', payload);
      setItemForm({ titulo: '', precio: '', categoria: categorias[0]?.id || '', especial_de_la_casa: false, plato_de_la_noche: false });
      await loadItems();
    } catch (err) {
      setError(err.message || 'No se pudo crear el plato');
    }
  };

  const deleteItem = async (id) => {
    setError('');
    try {
      await api.del(`/menu/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el plato');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      titulo: item.titulo || '',
      precio: item.precio ?? '',
      categoria: item.categoria || categorias[0]?.id || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setError('');
    try {
      const payload = { titulo: editForm.titulo, precio: Number(editForm.precio), categoria: editForm.categoria };
      await api.put(`/menu/${editingId}`, payload);
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el plato');
    }
  };

  return (
    <div className="page">
      <SectionHeader title="Menú" subtitle="Administrar categorías, platos y especiales" />

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
      </form>

      <form className="form" onSubmit={createItem} style={{ marginBottom: 16 }}>
        <div className="form__row">
          <div className="form__field">
            <label className="label">Título</label>
            <input className="input" value={itemForm.titulo} onChange={(e) => setItemForm({ ...itemForm, titulo: e.target.value })} placeholder="Nombre del plato" />
          </div>
          <div className="form__field">
            <label className="label">Precio</label>
            <input type="number" step="0.01" className="input" value={itemForm.precio} onChange={(e) => setItemForm({ ...itemForm, precio: e.target.value })} />
          </div>
          <div className="form__field">
            <label className="label">Categoría</label>
            <select className="input" value={itemForm.categoria} onChange={(e) => setItemForm({ ...itemForm, categoria: e.target.value })}>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="form__row">
          <div className="form__field">
            <label className="label">Especial de la casa</label>
            <input type="checkbox" checked={itemForm.especial_de_la_casa} onChange={(e) => setItemForm({ ...itemForm, especial_de_la_casa: e.target.checked })} />
          </div>
          <div className="form__field">
            <label className="label">Plato de la noche</label>
            <input type="checkbox" checked={itemForm.plato_de_la_noche} onChange={(e) => setItemForm({ ...itemForm, plato_de_la_noche: e.target.checked })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Crear plato</button>
        {error && <p className="muted" style={{ marginTop: 8 }}>{error}</p>}
      </form>

      <div className="table">
        <div className="table__head">
          <div>Título</div>
          <div>Categoría</div>
          <div>Precio</div>
          <div>Especial</div>
          <div>Noche</div>
          <div>Acciones</div>
        </div>
        {items.map((m) => (
          <div key={m.id} className="table__row">
            <div>
              {editingId === m.id ? (
                <input className="input" value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} />
              ) : (
                m.titulo
              )}
            </div>
            <div>
              {editingId === m.id ? (
                <select className="input" value={editForm.categoria} onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              ) : (
                m.categoria
              )}
            </div>
            <div>
              {editingId === m.id ? (
                <input type="number" step="0.01" className="input" value={editForm.precio} onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })} />
              ) : (
                m.precio
              )}
            </div>
            <div>{m.especial_de_la_casa ? 'Sí' : 'No'}</div>
            <div>{m.plato_de_la_noche ? 'Sí' : 'No'}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editingId === m.id ? (
                <>
                  <button className="btn btn-primary" onClick={saveEdit}>Guardar</button>
                  <button className="btn" onClick={cancelEdit}>Cancelar</button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={() => startEdit(m)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteItem(m.id)}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="table__empty">No hay platos en el menú.</div>
        )}
      </div>
    </div>
  );
};

export default MenuAdmin;
import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import { api } from '../../services/apiService';

const PlatosAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemForm, setItemForm] = useState({ titulo: '', descripcion: '', imagen: '', precio: '', categoria: '', especial_de_la_casa: false, plato_de_la_noche: false });
  const [imgBusy, setImgBusy] = useState(false);
  const [imgError, setImgError] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [imgName, setImgName] = useState('');
  const fileRef = useRef(null);
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
      setLoadingItems(true);
      const { items } = await api.get('/menu');
      setItems(items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar menú');
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => { loadCats(); loadItems(); }, []);

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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError('');
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    setImgName(file.name);
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    try {
      setImgError('');
      const file = fileRef.current?.files?.[0];
      if (!file) {
        setImgError('Selecciona una imagen');
        return;
      }
      setImgBusy(true);
      const fd = new FormData();
      fd.append('imagen', file);
      const { url } = await api.upload('/menu/imagen', fd, 'POST');
      setItemForm((f) => ({ ...f, imagen: url }));
      setImgBusy(false);
    } catch (err) {
      setImgBusy(false);
      setImgError(err.message || 'Error subiendo imagen');
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...itemForm, precio: Number(itemForm.precio) };
      await api.post('/menu', payload);
      setItemForm({ titulo: '', descripcion: '', imagen: '', precio: '', categoria: categorias[0]?.id || '', especial_de_la_casa: false, plato_de_la_noche: false });
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

  return (
    <div className="page admin-light">
      <SectionHeader title="Platos del Menú" subtitle="Crear y administrar platos" />

      <form className="form" onSubmit={createItem} style={{ marginBottom: 16 }}>
        <div className="grid grid-2">
          {/* Columna izquierda: datos del plato */}
          <div className="card">
            <div className="card__content">
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
                <div className="form__field" style={{ flex: 1 }}>
                  <label className="label">Descripción</label>
                  <textarea className="input" rows={3} value={itemForm.descripcion} onChange={(e) => setItemForm({ ...itemForm, descripcion: e.target.value })} placeholder="Descripción breve del plato" />
                </div>
              </div>
              <div className="form__row" style={{ gap: 10 }}>
                <div className="form__field" style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className={`btn ${itemForm.especial_de_la_casa ? 'btn btn--primary' : 'btn-dark'}`}
                    aria-pressed={itemForm.especial_de_la_casa}
                    onClick={() => setItemForm({ ...itemForm, especial_de_la_casa: !itemForm.especial_de_la_casa })}
                  >
                    {itemForm.especial_de_la_casa ? 'Especial de la casa ✓' : 'Especial de la casa'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${itemForm.plato_de_la_noche ? 'btn btn--primary' : 'btn-dark'}`}
                    aria-pressed={itemForm.plato_de_la_noche}
                    onClick={() => setItemForm({ ...itemForm, plato_de_la_noche: !itemForm.plato_de_la_noche })}
                  >
                    {itemForm.plato_de_la_noche ? 'Plato de la noche ✓' : 'Plato de la noche'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Columna derecha: imagen y preview */}
          <div className="card">
            <div className="card__content">
              <div className="form__row">
                <div className="form__field" style={{ flex: 1 }}>
                  <label className="label">Imagen del plato</label>
                  <input
                    id="imagenFile"
                    style={{ display: 'none' }}
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={handleImageSelect}
                  />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn--soft"
                      onClick={() => fileRef.current && fileRef.current.click()}
                    >
                      Seleccionar imagen
                    </button>
                    {imgName && <span className="muted" style={{ fontSize: 13 }}>{imgName}</span>}
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary"
                    style={{ marginTop: 10 }}
                    onClick={uploadImage}
                    disabled={imgBusy}
                  >
                    {imgBusy ? 'Subiendo...' : 'Subir imagen'}
                  </button>
                  {imgError && <p className="muted" style={{ marginTop: 6 }}>{imgError}</p>}
                </div>
              </div>
              {(imgPreview || itemForm.imagen) && (
                <div className="form__row">
                  <div className="form__field" style={{ flex: 1 }}>
                    <label className="label">Previsualización</label>
                    <Card
                      image={imgPreview || itemForm.imagen}
                      title={itemForm.titulo || 'Nombre del plato'}
                      description={itemForm.descripcion || 'Descripción breve'}
                      price={itemForm.precio || ''}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="actions" style={{ marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear plato</button>
        </div>
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
        {loadingItems && <div className="table__row">Cargando...</div>}
        {!loadingItems && items.map((m) => (
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
        {!loadingItems && items.length === 0 && (
          <div className="table__empty">No hay platos en el menú.</div>
        )}
      </div>
    </div>
  );
};

export default PlatosAdmin;
import { db, storage } from '../services/supabaseService.js';

// PUBLIC: Listar menú completo
export async function listMenu(_req, res, next) {
  try {
    const items = await db.findAll('menu');
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// PUBLIC: Listar categorías del menú
export async function listCategorias(_req, res, next) {
  try {
    const categorias = await db.findAll('categorias_menu', { filter: (q) => q.order('orden', { ascending: true }) });
    res.json({ ok: true, categorias });
  } catch (err) {
    next(err);
  }
}

// PUBLIC: Listar especiales de la casa y plato de la noche
export async function listEspeciales(_req, res, next) {
  try {
    const items = await db.findAll('menu', {
      filter: (q) => q.or('especial_de_la_casa.is.true,plato_de_la_noche.is.true')
    });
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Crear categoría
export async function createCategoria(req, res, next) {
  try {
    const { id, nombre, orden } = req.body || {};
    if (!id || !nombre) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'id y nombre son obligatorios' });
    }
    const cat = await db.insert('categorias_menu', { id, nombre, orden: orden ?? 99 });
    res.status(201).json({ ok: true, categoria: cat });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Actualizar categoría
export async function updateCategoria(req, res, next) {
  try {
    const id = req.params.id;
    const { nombre, orden } = req.body || {};
    const cat = await db.update('categorias_menu', id, { nombre, orden });
    res.json({ ok: true, categoria: cat });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Eliminar categoría
export async function deleteCategoria(req, res, next) {
  try {
    const id = req.params.id;
    await db.remove('categorias_menu', id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Crear item de menú
export async function createItem(req, res, next) {
  try {
    const { titulo, descripcion, imagen, precio, categoria, activo } = req.body || {};
    if (!titulo || !precio || !categoria) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'titulo, precio y categoria son obligatorios' });
    }
    const item = await db.insert('menu', {
      titulo,
      descripcion: descripcion || null,
      imagen: imagen || null,
      precio,
      categoria,
      activo: activo ?? true
    });
    res.status(201).json({ ok: true, item });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Actualizar item de menú
export async function updateItem(req, res, next) {
  try {
    const id = req.params.id;
    const { titulo, descripcion, imagen, precio, categoria, activo } = req.body || {};
    const item = await db.update('menu', id, {
      titulo,
      descripcion,
      imagen,
      precio,
      categoria,
      activo
    });
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Eliminar item de menú
export async function deleteItem(req, res, next) {
  try {
    const id = req.params.id;
    await db.remove('menu', id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Subir imagen de plato al bucket propio
const MENU_BUCKET = 'menu-images';
export async function uploadMenuImage(req, res, next) {
  try {
    const file = req.file; // via multer
    if (!file) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'Falta archivo de imagen' });
    }
    const mime = file.mimetype || 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : mime.includes('jpeg') ? 'jpeg' : 'jpg';
    const path = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await storage.upload(MENU_BUCKET, path, file.buffer, mime);
    const url = storage.publicUrl(MENU_BUCKET, path);
    res.status(201).json({ ok: true, url, path });
  } catch (err) {
    next(err);
  }
}
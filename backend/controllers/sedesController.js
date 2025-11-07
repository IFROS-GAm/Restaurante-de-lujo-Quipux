import { db } from '../services/supabaseService.js';

// PUBLIC: Listar sedes
export async function listSedes(_req, res, next) {
  try {
    const items = await db.findAll('sedes', { filter: (q) => q.order('nombre', { ascending: true }) });
    // Enriquecer con lista de pisos basada en `cantidad_pisos` (sin tabla `pisos`)
    items.forEach((s) => {
      const n = Number(s?.cantidad_pisos);
      if (Number.isInteger(n) && n > 0) {
        s.pisos = Array.from({ length: n }, (_, i) => String(i + 1));
      } else {
        s.pisos = [];
      }
    });
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Crear sede
export async function createSede(req, res, next) {
  try {
    const { id, nombre, direccion, cantidad_pisos } = req.body || {};
    if (!id || !nombre) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'id y nombre son obligatorios' });
    }
    const n = Number(cantidad_pisos);
    let sede;
    // Intentar guardar cantidad_pisos si la columna existe; si no, fallback sin ese campo
    try {
      const payload = { id, nombre, direccion: direccion || null };
      if (Number.isInteger(n) && n > 0) payload.cantidad_pisos = n;
      sede = await db.insert('sedes', payload);
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.includes('column') || msg.includes('schema cache')) {
        // Reintentar sin cantidad_pisos para no bloquear la operación
        sede = await db.insert('sedes', { id, nombre, direccion: direccion || null });
      } else {
        throw err;
      }
    }
    res.status(201).json({ ok: true, sede });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Actualizar sede
export async function updateSede(req, res, next) {
  try {
    const id = req.params.id;
    const { nombre, direccion, cantidad_pisos } = req.body || {};
    const m = Number(cantidad_pisos);
    let sede;
    try {
      const payload = { nombre, direccion };
      if (Number.isInteger(m) && m > 0) payload.cantidad_pisos = m;
      sede = await db.update('sedes', id, payload);
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.includes('column') || msg.includes('schema cache')) {
        sede = await db.update('sedes', id, { nombre, direccion });
      } else {
        throw err;
      }
    }
    res.json({ ok: true, sede });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Eliminar sede
export async function deleteSede(req, res, next) {
  try {
    const id = req.params.id;
    await db.remove('sedes', id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
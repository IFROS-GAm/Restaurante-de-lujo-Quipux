import { db } from '../services/supabaseService.js';

// PUBLIC: Listar pisos por sede (derivado de `sedes.cantidad_pisos`)
export async function listPisos(req, res, next) {
  try {
    const { sede } = req.query || {};
    if (!sede) return res.json({ ok: true, items: [] });
    const sedeData = await db.findById('sedes', sede);
    const n = Number(sedeData?.cantidad_pisos);
    const items = Number.isInteger(n) && n > 0
      ? Array.from({ length: n }, (_, i) => ({ nivel: String(i + 1) }))
      : [];
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// PUBLIC: Listar mesas por sede/piso
export async function listMesas(req, res, next) {
  try {
    const { sede, piso, fecha, hora } = req.query || {};
    // 1) Listar mesas por sede/piso
    const items = await db.findAll('mesas', {
      filter: (q) => {
        let qq = q.order('id', { ascending: true });
        if (sede) qq = qq.eq('sede_id', sede); // columna real en DB
        if (piso) qq = qq.eq('piso', String(piso));
        return qq;
      }
    });

    // 2) Correlacionar estado de mesas con reservas
    // Si se especifica fecha/hora, marcamos 'reservada' cuando exista una reserva pendiente/confirmada para esa mesa.
    // Si no se especifica fecha, usamos la fecha de hoy por defecto para dar contexto.
    const fechaFiltro = fecha || new Date().toISOString().slice(0, 10);
    const ids = Array.from(new Set((items || []).map((m) => m.id)));
    if (ids.length > 0) {
      try {
        const reservas = await db.findAll('reservas', {
          filter: (q) => {
            let qq = q.eq('fecha', fechaFiltro);
            if (sede) qq = qq.eq('sede', sede);
            if (hora) qq = qq.eq('hora', hora);
            qq = qq.in('mesa', ids);
            return qq;
          }
        });
        const map = new Map(); // mesaId -> lista estados reservas
        for (const r of reservas || []) {
          const arr = map.get(r.mesa) || [];
          arr.push(r.estado);
          map.set(r.mesa, arr);
        }
        for (const m of items || []) {
          const estados = map.get(m.id) || [];
          const hasActiva = estados.some((e) => e === 'pendiente' || e === 'confirmada');
          if (hasActiva) {
            m.estado = 'reservada';
          } else if (!m.estado) {
            m.estado = 'libre';
          }
        }
      } catch (_) {
        // si la consulta de reservas falla, no bloqueamos la respuesta de mesas
      }
    }

    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Crear mesa
export async function createMesa(req, res, next) {
  try {
    const { id, sede, piso, capacidad, estado } = req.body || {};
    if (!id || !sede || !piso || !capacidad) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'id, sede, piso y capacidad son obligatorios' });
    }
    // Validación: el piso no debe exceder `sedes.cantidad_pisos`
    let maxNivel;
    try {
      const sedeData = await db.findById('sedes', sede);
      const cp = Number(sedeData?.cantidad_pisos);
      if (Number.isInteger(cp) && cp > 0) {
        maxNivel = cp;
      } else {
        return res.status(400).json({ ok: false, code: 'NO_FLOORS_DEFINED', message: 'La sede seleccionada no tiene pisos definidos' });
      }
    } catch (_) {
      return res.status(400).json({ ok: false, code: 'NO_FLOORS_DEFINED', message: 'La sede seleccionada no tiene pisos definidos' });
    }
    const pisoNum = Number(piso);
    if (Number.isNaN(pisoNum) || pisoNum < 1) {
      return res.status(400).json({ ok: false, code: 'INVALID_FLOOR_NUMBER', message: 'El número de piso debe ser un entero mayor o igual a 1' });
    }
    if (pisoNum > maxNivel) {
      return res.status(400).json({ ok: false, code: 'FLOOR_OUT_OF_RANGE', message: `El piso no puede exceder ${maxNivel} para esta sede` });
    }
    const mesa = await db.insert('mesas', {
      id,
      // En DB la columna es sede_id
      sede_id: sede,
      piso: String(pisoNum),
      capacidad: Number(capacidad),
      estado: estado || 'libre'
    });
    res.status(201).json({ ok: true, mesa });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Actualizar mesa
export async function updateMesa(req, res, next) {
  try {
    const id = req.params.id;
    const { sede, piso, capacidad, estado } = req.body || {};
    const payload = { piso, capacidad, estado };
    // Si viene sede, mapear a sede_id
    if (sede) payload.sede_id = sede;
    const mesa = await db.update('mesas', id, payload);
    res.json({ ok: true, mesa });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Eliminar mesa
export async function deleteMesa(req, res, next) {
  try {
    const id = req.params.id;
    await db.remove('mesas', id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
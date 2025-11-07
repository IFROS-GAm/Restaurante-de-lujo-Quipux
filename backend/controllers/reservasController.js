import { db } from '../services/supabaseService.js';

export async function crearReserva(req, res, next) {
  try {
    const userId = req.user?.id;
    const { sede, piso, mesa, personas, fecha, hora, notas } = req.body;
    if (!userId || !sede || !mesa || !personas || !fecha || !hora) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'Campos requeridos: sede, mesa, personas, fecha, hora' });
    }
    const payload = {
      user_id: userId,
      sede,
      piso: piso || null,
      mesa,
      personas,
      fecha,
      hora,
      notas: notas || null,
      estado: 'pendiente'
    };
    const reserva = await db.insert('reservas', payload);
    res.status(201).json({ ok: true, reserva });
  } catch (err) {
    next(err);
  }
}

export async function misReservas(req, res, next) {
  try {
    const userId = req.user?.id;
    const items = await db.findAll('reservas', {
      filter: (q) => q.eq('user_id', userId).order('fecha', { ascending: true }).order('hora', { ascending: true })
    });
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
}

// Listar todas las reservas (solo admin), con filtros opcionales por fecha y sede
export async function listarReservas(req, res, next) {
  try {
    const { fecha, sede } = req.query || {};
    const items = await db.findAll('reservas', {
      filter: (q) => {
        let qq = q.order('fecha', { ascending: true }).order('hora', { ascending: true });
        if (fecha) qq = qq.eq('fecha', fecha);
        if (sede) qq = qq.eq('sede', sede);
        return qq;
      }
    });
    // Enriquecer con datos del usuario (nombre y teléfono)
    const ids = Array.from(new Set((items || []).map((r) => r.user_id).filter(Boolean)));
    let usersById = {};
    if (ids.length > 0) {
      try {
        const users = await db.findAll('users', {
          select: 'id,name,phone',
          filter: (q) => q.in('id', ids)
        });
        usersById = Object.fromEntries((users || []).map((u) => [u.id, u]));
      } catch (_) {
        usersById = {};
      }
    }
    const enriched = (items || []).map((r) => ({
      ...r,
      user_name: usersById[r.user_id]?.name || null,
      user_phone: usersById[r.user_id]?.phone || null
    }));
    res.json({ ok: true, items: enriched });
  } catch (err) {
    next(err);
  }
}

// ADMIN: Actualizar estado (y notas opcional) de una reserva
export async function updateReserva(req, res, next) {
  try {
    const id = req.params.id;
    const { estado, notas } = req.body || {};

    // Validación básica: solo permitimos estados conocidos
    const allowed = new Set(['pendiente', 'confirmada', 'cancelada', 'completada']);
    const payload = {};
    if (typeof estado === 'string') {
      const e = estado.trim().toLowerCase();
      if (!allowed.has(e)) {
        return res.status(400).json({ ok: false, code: 'INVALID_STATUS', message: 'Estado inválido' });
      }
      payload.estado = e;
    }
    if (typeof notas === 'string') {
      payload.notas = notas;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ ok: false, code: 'EMPTY_UPDATE', message: 'No hay campos válidos para actualizar' });
    }

    const reserva = await db.update('reservas', id, payload);
    res.json({ ok: true, reserva });
  } catch (err) {
    next(err);
  }
}
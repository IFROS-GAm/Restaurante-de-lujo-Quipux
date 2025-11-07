import jwt from 'jsonwebtoken';
import { db } from '../services/supabaseService.js';

export function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, code: 'NO_TOKEN', message: 'Falta token de autorización' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, code: 'INVALID_TOKEN', message: 'Token inválido o expirado' });
  }
}

// Requiere que el usuario autenticado tenga rol 'admin'.
// Debe ser usado DESPUÉS de requireAuth para garantizar que req.user exista.
export async function requireAdmin(req, res, next) {
  try {
    const authUser = req.user;
    if (!authUser) {
      return res.status(401).json({ ok: false, code: 'NO_USER', message: 'Usuario no autenticado' });
    }
    // Validar el rol siempre contra la BD para evitar tokens con rol obsoleto
    const freshUser = await db.findById('users', authUser.id, 'id,role');
    const role = freshUser?.role || authUser.role;
    if (role !== 'admin') {
      return res.status(403).json({ ok: false, code: 'FORBIDDEN', message: 'Se requiere rol administrador' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ ok: false, code: 'ROLE_CHECK_FAILED', message: 'No se pudo verificar rol de usuario', details: err?.message });
  }
}
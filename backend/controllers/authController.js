import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/supabaseService.js';

const TOKEN_TTL = '7d';

function signToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'name, email y password son obligatorios' });
    }
    const exists = await db.findUserByEmail(email);
    if (exists) {
      return res.status(409).json({ ok: false, code: 'EMAIL_EXISTS', message: 'El correo ya está registrado' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.insert('users', { name, email, password_hash, role: 'cliente' });
    const token = signToken(user);
    res.status(201).json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'email y password son obligatorios' });
    }
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ ok: false, code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' });
    }
    const token = signToken(user);
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }, token });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  const user = req.user; // del middleware
  res.json({ ok: true, user });
}

// Cambiar contraseña del usuario autenticado
export async function changePassword(req, res, next) {
  try {
    const userId = req.user?.id;
    const { current_password, new_password } = req.body || {};
    if (!userId || !current_password || !new_password) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'current_password y new_password son obligatorios' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ ok: false, code: 'WEAK_PASSWORD', message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await db.findById('users', userId, '*');
    if (!user || !user.password_hash) {
      return res.status(404).json({ ok: false, code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' });
    }
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ ok: false, code: 'INVALID_CURRENT_PASSWORD', message: 'La contraseña actual no coincide' });
    }
    const password_hash = await bcrypt.hash(new_password, 10);
    await db.update('users', userId, { password_hash });
    return res.json({ ok: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
}
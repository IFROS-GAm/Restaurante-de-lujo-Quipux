import { db, storage } from '../services/supabaseService.js';

const AVATARS_BUCKET = 'avatars';

export async function getProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    const user = await db.findById('users', userId, 'id,name,email,role,phone,avatar_url');
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    const { name, phone } = req.body;
    const updated = await db.update('users', userId, { name, phone });
    res.json({ ok: true, user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone, avatar_url: updated.avatar_url } });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    const userId = req.user?.id;
    const file = req.file; // via multer
    if (!userId || !file) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', message: 'Faltan usuario o archivo avatar' });
    }
    const mime = file.mimetype || 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
    const path = `user-${userId}/${Date.now()}.${ext}`;
    await storage.upload(AVATARS_BUCKET, path, file.buffer, mime);
    const publicUrl = storage.publicUrl(AVATARS_BUCKET, path);
    const updated = await db.update('users', userId, { avatar_url: publicUrl });
    res.json({ ok: true, user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone, avatar_url: updated.avatar_url } });
  } catch (err) {
    next(err);
  }
}
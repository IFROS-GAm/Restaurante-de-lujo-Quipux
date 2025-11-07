export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Error interno del servidor';
  const details = process.env.NODE_ENV === 'production' ? undefined : err;
  if (status >= 500) {
    console.error('[errorHandler]', err);
  }
  res.status(status).json({ ok: false, code, message, details });
}
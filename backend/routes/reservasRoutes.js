import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { crearReserva, misReservas, listarReservas, updateReserva } from '../controllers/reservasController.js';

const router = Router();

// Crear una reserva (usuario autenticado)
router.post('/', requireAuth, crearReserva);

// Listar reservas del usuario autenticado
router.get('/mine', requireAuth, misReservas);

// Listar todas las reservas (admin)
router.get('/', requireAuth, requireAdmin, listarReservas);

// Actualizar una reserva (admin): estado, notas
router.put('/:id', requireAuth, requireAdmin, updateReserva);

export default router;
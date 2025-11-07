import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import {
  listPisos,
  listMesas,
  createMesa,
  updateMesa,
  deleteMesa
} from '../controllers/mesasController.js';

const router = Router();

// Públicos
router.get('/pisos', listPisos); // ?sede=centro
router.get('/', listMesas); // ?sede=centro&piso=1

// Admin
// Eliminados: crear/eliminar pisos (se gestionan desde sedes)

router.post('/', requireAuth, requireAdmin, createMesa);
router.put('/:id', requireAuth, requireAdmin, updateMesa);
router.delete('/:id', requireAuth, requireAdmin, deleteMesa);

export default router;
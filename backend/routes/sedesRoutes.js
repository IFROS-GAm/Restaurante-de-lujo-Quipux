import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { listSedes, createSede, updateSede, deleteSede } from '../controllers/sedesController.js';

const router = Router();

// Públicos
router.get('/', listSedes);

// Admin
router.post('/', requireAuth, requireAdmin, createSede);
router.put('/:id', requireAuth, requireAdmin, updateSede);
router.delete('/:id', requireAuth, requireAdmin, deleteSede);

export default router;
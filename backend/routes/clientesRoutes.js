import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/clientesController.js';
import multer from 'multer';

// Multer en memoria para recibir archivos de imagen
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
// Acepta PUT y POST para compatibilidad con distintos clientes
router.put('/avatar', requireAuth, upload.single('avatar'), uploadAvatar);
router.post('/avatar', requireAuth, upload.single('avatar'), uploadAvatar);

export default router;
import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import {
  listMenu,
  listCategorias,
  listEspeciales,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  createItem,
  updateItem,
  deleteItem,
  uploadMenuImage
} from '../controllers/menuController.js';

const router = Router();
// Multer en memoria para imágenes de menú
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Públicos
router.get('/', listMenu);
router.get('/categorias', listCategorias);
router.get('/especiales', listEspeciales);

// Admin: categorías
router.post('/categorias', requireAuth, requireAdmin, createCategoria);
router.put('/categorias/:id', requireAuth, requireAdmin, updateCategoria);
router.delete('/categorias/:id', requireAuth, requireAdmin, deleteCategoria);

// Admin: items
router.post('/', requireAuth, requireAdmin, createItem);
router.put('/:id', requireAuth, requireAdmin, updateItem);
router.delete('/:id', requireAuth, requireAdmin, deleteItem);
// Admin: subir imagen de plato
router.post('/imagen', requireAuth, requireAdmin, upload.single('imagen'), uploadMenuImage);

export default router;
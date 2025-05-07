import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import verifyToken from '../utils/authMiddleware';

const router = Router();

// POST /api/category  Create a new category
router.post('/create', verifyToken, createCategory);

// GET /api/category  Fetch all categories as a tree
router.get('/list', verifyToken, getCategories);

// PUT /api/category/:id  Update category
router.put('/update/:id', verifyToken, updateCategory);

// DELETE /api/category/:id  Delete and reassign
router.delete('/delete/:id', verifyToken, deleteCategory);

export default router;

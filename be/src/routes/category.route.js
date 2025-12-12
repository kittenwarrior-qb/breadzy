import express from 'express';

import {getAllCategories, getCategoryById, getCategoryBySlug} from '../controllers/category/get.js';
import {createCategory} from '../controllers/category/post.js';
import { deleteCategoryById } from '../controllers/category/delete.js';
import { updateCategoryById } from '../controllers/category/put.js';


const router = express.Router();

router.get('/', getAllCategories);     
router.get('/slug/:slug', getCategoryBySlug);       
router.get('/:id', getCategoryById);       

router.post('/', createCategory);

router.put('/:id', updateCategoryById)

router.delete('/:id', deleteCategoryById)


export default router;
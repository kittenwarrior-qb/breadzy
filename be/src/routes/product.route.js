import express from 'express';
import upload from '../configs/upload.js'

import { getAllProducts, getProductById, getProductBySlug } from '../controllers/product/get.js';
import { createProduct } from '../controllers/product/post.js';
import { updateProductById } from '../controllers/product/put.js';
import { deleteProductById } from '../controllers/product/delete.js';

const router = express.Router();

router.get('/', getAllProducts);           
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);       

router.post('/', upload.single("file") ,createProduct);           

router.put('/:id', updateProductById);     

router.delete('/:id', deleteProductById); 

export default router;

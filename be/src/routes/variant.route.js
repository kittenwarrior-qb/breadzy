import express from 'express';
import upload from '../configs/upload.js';

import {
  getAllVariants,
  getAllVariantsByProductSlug,
  getVariantById,
  getVariantBySlug,
  getFirstVariantFromProducts
} from '../controllers/variant/get.js';

import { createVariant, uploadVariantImages } from '../controllers/variant/post.js';
import { deleteVariantById } from '../controllers/variant/delete.js';
import { updateVariantById } from '../controllers/variant/put.js';

const router = express.Router();

router.get('/', getAllVariants);
router.get('/product/:productSlug', getAllVariantsByProductSlug);
router.get('/get-first-variant', getFirstVariantFromProducts)
router.get('/slug/:slug', getVariantBySlug);
router.get('/:id', getVariantById);

router.post('/', createVariant);
router.post('/upload', upload.single('file'), uploadVariantImages);

router.put('/:id', updateVariantById);

router.delete('/:id', deleteVariantById)

export default router;  

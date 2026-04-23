import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@ecommerce/shared';
import { adminOnly } from './middleware';

const router = Router();

const ProductSchema = z.object({
  name:        z.string().min(1),
  description: z.string().optional(),
  price:       z.number().positive(),
  category:    z.string().min(1),
  emoji:       z.string().default('📦'),
  inStock:     z.boolean().default(true),
});

// GET /products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ products });
  } catch (err) {
    console.error('[Products] GET error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /products/:id
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /products
router.post('/products', adminOnly, async (req: Request, res: Response) => {
  const parsed = ProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  try {
    const product = await prisma.product.create({ data: parsed.data });
    console.log(`[Products] Created: ${product.name}`);
    return res.status(201).json({ product });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /products/:id
router.put('/products/:id', adminOnly, async (req: Request, res: Response) => {
  const parsed = ProductSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data:  parsed.data,
    });
    console.log(`[Products] Updated: ${product.name}`);
    return res.json({ product });
  } catch {
    return res.status(404).json({ error: 'Product not found' });
  }
});

// DELETE /products/:id
router.delete('/products/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    console.log(`[Products] Deleted: ${req.params.id}`);
    return res.json({ message: 'Product deleted' });
  } catch {
    return res.status(404).json({ error: 'Product not found' });
  }
});

export default router;

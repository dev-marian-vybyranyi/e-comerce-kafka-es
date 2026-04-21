import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  createProducer,
  publishMessage,
  OrderCreatedEvent,
  TOPICS,
  register,
  httpRequestsTotal,
} from "@ecommerce/shared";
import {
  insertOrder,
  getOrder,
  getAllOrders,
  getOrdersCount,
} from "./database";
import { sseManager } from "./sse";

const router = Router();
let producer: Awaited<ReturnType<typeof createProducer>>;

export async function initProducer(): Promise<void> {
  producer = await createProducer("order-service");
}

// Validation schema
const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const CreateOrderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(OrderItemSchema).min(1),
});

// POST /orders
router.post("/orders", async (req: Request, res: Response) => {
  const parsed = CreateOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { userId, items } = parsed.data;
  const orderId = uuidv4();
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const createdAt = new Date().toISOString();

  const event: OrderCreatedEvent = {
    orderId,
    userId,
    items,
    totalAmount,
    createdAt,
  };

  insertOrder({
    orderId,
    userId,
    items: JSON.stringify(items),
    totalAmount,
    status: "PENDING",
    createdAt,
    updatedAt: createdAt,
  });

  await publishMessage(producer, TOPICS.ORDERS, event, userId);
  console.log(`[Producer] Order created: ${orderId}`);

  httpRequestsTotal.inc({ method: "POST", route: "/orders", status: "201" });
  return res.status(201).json({ orderId, status: "PENDING", totalAmount });
});

// GET /orders
router.get("/orders", (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  const orders = getAllOrders(limit, offset).map((o) => ({
    ...o,
    items: JSON.parse(o.items),
  }));

  const total = getOrdersCount();
  httpRequestsTotal.inc({ method: "GET", route: "/orders", status: "200" });
  return res.json({ orders, total, limit, offset });
});

// GET /orders/:id
router.get("/orders/:id", (req: Request, res: Response) => {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  httpRequestsTotal.inc({ method: "GET", route: "/orders/:id", status: "200" });
  return res.json({ ...order, items: JSON.parse(order.items) });
});

// GET /events (SSE)
router.get("/events", (req: Request, res: Response) => {
  const clientId = uuidv4();
  sseManager.addClient(clientId, res);
});

// GET /health
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "order-service",
    uptime: process.uptime(),
  });
});

// GET /metrics
router.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

export default router;

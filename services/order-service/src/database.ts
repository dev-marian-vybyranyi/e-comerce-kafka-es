import { OrderStatus } from "@ecommerce/shared";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

declare global {
  var prismaOrder: PrismaClient | undefined;
}

export const prisma = global.prismaOrder || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaOrder = prisma;
}

export interface OrderRow {
  orderId: string;
  userId: string;
  items: string;
  totalAmount: number;
  status: OrderStatus;
  courier: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function insertOrder(
  order: Omit<OrderRow, "courier">,
): Promise<void> {
  await prisma.order.create({
    data: {
      orderId: order.orderId,
      userId: order.userId,
      items: JSON.parse(order.items),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  courier?: string,
): Promise<void> {
  await prisma.order.update({
    where: { orderId },
    data: {
      status,
      courier: courier ?? null,
      updatedAt: new Date(),
    },
  });
}

export async function getOrder(orderId: string): Promise<OrderRow | null> {
  const order = await prisma.order.findUnique({ where: { orderId } });
  if (!order) return null;
  return {
    ...order,
    items: JSON.stringify(order.items),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    status: order.status as OrderStatus,
  };
}

export async function getAllOrders(
  limit = 50,
  offset = 0,
): Promise<OrderRow[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
  return orders.map((o) => ({
    ...o,
    items: JSON.stringify(o.items),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    status: o.status as OrderStatus,
  }));
}

export async function getOrdersCount(): Promise<number> {
  return prisma.order.count();
}

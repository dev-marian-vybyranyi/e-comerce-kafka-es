import Database from "better-sqlite3";
import path from "path";
import { OrderStatus } from "@ecommerce/shared";

const db = new Database(path.join(__dirname, "../orders.db"));

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

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    orderId     TEXT PRIMARY KEY,
    userId      TEXT NOT NULL,
    items       TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    status      TEXT NOT NULL DEFAULT 'PENDING',
    courier     TEXT,
    createdAt   TEXT NOT NULL,
    updatedAt   TEXT NOT NULL
  )
`);

export const db_instance: Database.Database = db;

export function insertOrder(order: Omit<OrderRow, "courier">): void {
  db.prepare(
    `
    INSERT INTO orders (orderId, userId, items, totalAmount, status, createdAt, updatedAt)
    VALUES (@orderId, @userId, @items, @totalAmount, @status, @createdAt, @updatedAt)
  `,
  ).run(order);
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  courier?: string,
): void {
  db.prepare(
    `
    UPDATE orders
    SET status = @status, courier = @courier, updatedAt = @updatedAt
    WHERE orderId = @orderId
  `,
  ).run({
    orderId,
    status,
    courier: courier || null,
    updatedAt: new Date().toISOString(),
  });
}

export function getOrder(orderId: string): OrderRow | undefined {
  return db.prepare("SELECT * FROM orders WHERE orderId = ?").get(orderId) as
    | OrderRow
    | undefined;
}

export function getAllOrders(limit = 50, offset = 0): OrderRow[] {
  return db
    .prepare("SELECT * FROM orders ORDER BY createdAt DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as OrderRow[];
}

export function getOrdersCount(): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM orders").get() as {
    count: number;
  };
  return row.count;
}

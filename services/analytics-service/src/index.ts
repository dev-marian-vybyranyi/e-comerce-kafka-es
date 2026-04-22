import {
  createProducer,
  OrderStatsEvent,
  publishMessage,
  register,
  setupGracefulShutdown,
  TOPICS,
} from "@ecommerce/shared";
import cors from "cors";
import express from "express";
import { startConsumer } from "./consumer";
import { ordersPerMinute, revenuePerMinute } from "./metrics";
import { windowManager } from "./window";

const PORT = parseInt(process.env.ANALYTICS_SERVICE_PORT || "3004");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "analytics-service",
    uptime: process.uptime(),
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/stats", (_req, res) => {
  const stats = windowManager.getCurrentStats();
  res.json(stats);
});

async function main(): Promise<void> {
  try {
    const producer = await createProducer("analytics-service");
    await startConsumer();

    setInterval(async () => {
      const stats = windowManager.getCurrentStats();

      ordersPerMinute.set(stats.ordersCount);
      revenuePerMinute.set(stats.totalRevenue);

      const event: OrderStatsEvent = {
        windowStart: stats.windowStart,
        ordersCount: stats.ordersCount,
        totalRevenue: stats.totalRevenue,
        successRate: stats.successRate,
        avgProcessingMs: stats.avgProcessingMs,
      };

      await publishMessage(producer, TOPICS.ORDER_STATS, event);
      console.log(`[Analytics] Stats published:`, JSON.stringify(event));
    }, 10_000);

    app.listen(PORT, () => {
      console.log(`[analytics-service] Running on http://localhost:${PORT}`);
    });

    setupGracefulShutdown([producer], "analytics-service");
  } catch (err) {
    console.error("[analytics-service] Failed to start:", err);
    process.exit(1);
  }
}

main();

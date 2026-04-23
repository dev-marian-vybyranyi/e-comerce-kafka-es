import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma, register } from "@ecommerce/shared";
import router from "./routes";

const PORT = parseInt(process.env.PRODUCT_SERVICE_PORT || "3007");
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "product-service",
    uptime: process.uptime(),
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

async function main() {
  await prisma.$connect();
  console.log("[product-service] Database connected");

  app.listen(PORT, () => {
    console.log(`[product-service] Running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("[product-service] Failed to start:", err);
  process.exit(1);
});

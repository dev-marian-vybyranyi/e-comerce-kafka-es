import { register, setupGracefulShutdown } from "@ecommerce/shared";
import cors from "cors";
import express from "express";
import { startConsumers } from "./consumer";
import { ensureIndex } from "./elastic";
import router from "./routes";

const PORT = parseInt(process.env.SEARCH_SERVICE_PORT || "3005");
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "search-service",
    uptime: process.uptime(),
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

async function main(): Promise<void> {
  try {
    await ensureIndex();
    await startConsumers();

    app.listen(PORT, () => {
      console.log(`[search-service] Running on http://localhost:${PORT}`);
    });

    setupGracefulShutdown([], "search-service");
  } catch (err) {
    console.error("[search-service] Failed to start:", err);
    process.exit(1);
  }
}

main();

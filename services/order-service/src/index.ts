import { setupGracefulShutdown } from "@ecommerce/shared";
import cors from "cors";
import express from "express";
import { startConsumer } from "./consumer";
import router, { initProducer } from "./routes";

const PORT = parseInt(process.env.ORDER_SERVICE_PORT || "3001");
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

async function main(): Promise<void> {
  try {
    await initProducer();
    await startConsumer();

    app.listen(PORT, () => {
      console.log(`[order-service] Running on http://localhost:${PORT}`);
    });

    setupGracefulShutdown([], "order-service");
  } catch (err) {
    console.error("[order-service] Failed to start:", err);
    process.exit(1);
  }
}

main();

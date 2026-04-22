import cors from "cors";
import express from "express";
import { prisma } from "./prisma";
import router from "./routes";

const PORT = parseInt(process.env.AUTH_SERVICE_PORT || "3006");
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service", uptime: process.uptime() });
});

async function main(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("[Auth] Database connected");

    app.listen(PORT, () => {
      console.log(`[auth-service] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[Auth] Failed to start:", err);
    process.exit(1);
  }
}

main();

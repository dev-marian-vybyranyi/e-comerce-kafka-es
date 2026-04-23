import "dotenv/config";
import axios, { AxiosRequestConfig } from "axios";
import cors from "cors";
import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "./middleware";

const app = express();
const PORT = parseInt(process.env.GATEWAY_PORT || "8000");

const PROTECTED_AUTH_ROUTES = ["/auth/me", "/auth/logout-all"];

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());

async function proxyRequest(
  req: Request,
  res: Response,
  targetUrl: string,
  extraHeaders: Record<string, string> = {},
): Promise<void> {
  try {
    const config: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig["method"],
      url: targetUrl,
      headers: {
        "content-type": "application/json",
        "x-user-id": extraHeaders["x-user-id"] ?? "",
        "x-username": extraHeaders["x-username"] ?? "",
        "x-user-email": extraHeaders["x-user-email"] ?? "",
        "x-user-role": extraHeaders["x-user-role"] ?? "",
      },
      data: req.body,
      params: req.query,
      validateStatus: () => true,
      responseType: "json",
    };
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("[Gateway] Proxy error:", err);
    res.status(502).json({ error: "Bad gateway" });
  }
}

function getUserHeaders(req: AuthRequest): Record<string, string> {
  return {
    "x-user-id": req.user?.userId ?? "",
    "x-username": req.user?.username ?? "",
    "x-user-email": req.user?.email ?? "",
    "x-user-role": req.user?.role ?? "user",
  };
}

// Health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway", uptime: process.uptime() });
});

// Auth
app.all("/api/auth/:path(*)", async (req: Request, res: Response) => {
  const authPath = "/auth/" + req.params.path;
  const isProtected = PROTECTED_AUTH_ROUTES.includes(authPath);

  if (isProtected) {
    authMiddleware(req as AuthRequest, res, async () => {
      const authReq = req as AuthRequest;
      await proxyRequest(
        req,
        res,
        `http://localhost:3006${authPath}`,
        getUserHeaders(authReq),
      );
    });
  } else {
    await proxyRequest(req, res, `http://localhost:3006${authPath}`);
  }
});

// SSE Events
app.get("/api/events", authMiddleware, (req: AuthRequest, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  axios
    .get("http://localhost:3001/events", {
      responseType: "stream",
      headers: getUserHeaders(req),
    })
    .then((response) => {
      response.data.pipe(res);
      req.on("close", () => response.data.destroy());
    })
    .catch(() => res.end());
});

// Orders
app.all(
  "/api/orders/:path(*)",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const path = "/" + req.params.path;
    await proxyRequest(
      req,
      res,
      `http://localhost:3001/orders${path}`,
      getUserHeaders(req),
    );
  },
);

app.all(
  "/api/orders",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    await proxyRequest(
      req,
      res,
      "http://localhost:3001/orders",
      getUserHeaders(req),
    );
  },
);

// Search
app.all(
  "/api/search/:path(*)",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const path = "/" + req.params.path;
    await proxyRequest(
      req,
      res,
      `http://localhost:3005/search${path}`,
      getUserHeaders(req),
    );
  },
);

app.all(
  "/api/search",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    await proxyRequest(
      req,
      res,
      "http://localhost:3005/search",
      getUserHeaders(req),
    );
  },
);

// Analytics
app.all(
  "/api/analytics",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    await proxyRequest(
      req,
      res,
      "http://localhost:3004/stats",
      getUserHeaders(req),
    );
  },
);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`[api-gateway] Running on http://localhost:${PORT}`);
});

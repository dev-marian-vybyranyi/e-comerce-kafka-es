import { Response } from "express";

class SSEManager {
  private clients: Map<string, Response> = new Map();

  addClient(clientId: string, res: Response): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    const pingInterval = setInterval(() => {
      res.write(": ping\n\n");
    }, 30000);

    this.clients.set(clientId, res);
    console.log(
      `[SSE] Client connected: ${clientId}, total: ${this.clients.size}`,
    );

    res.on("close", () => {
      clearInterval(pingInterval);
      this.clients.delete(clientId);
      console.log(
        `[SSE] Client disconnected: ${clientId}, total: ${this.clients.size}`,
      );
    });
  }

  broadcast(event: string, data: unknown): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const [, res] of this.clients) {
      res.write(payload);
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();

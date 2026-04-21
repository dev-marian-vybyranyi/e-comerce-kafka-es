interface WindowData {
  windowStart: string;
  ordersCount: number;
  totalRevenue: number;
  successCount: number;
  failCount: number;
  totalProcessingMs: number;
  processedCount: number;
  orderCreatedAt: Map<string, number>;
}

const WINDOW_SIZE_MS = 60_000; // 1 хвилина
const WINDOW_EXPIRY_MS = 120_000; // 2 хвилини

class SlidingWindowManager {
  private windows: Map<string, WindowData> = new Map();

  private getWindowKey(timestamp: number): string {
    const windowStart = Math.floor(timestamp / WINDOW_SIZE_MS) * WINDOW_SIZE_MS;
    return new Date(windowStart).toISOString();
  }

  private getOrCreateWindow(timestamp: number): WindowData {
    const key = this.getWindowKey(timestamp);

    if (!this.windows.has(key)) {
      this.windows.set(key, {
        windowStart: key,
        ordersCount: 0,
        totalRevenue: 0,
        successCount: 0,
        failCount: 0,
        totalProcessingMs: 0,
        processedCount: 0,
        orderCreatedAt: new Map(),
      });
    }

    return this.windows.get(key)!;
  }

  recordOrder(orderId: string, totalAmount: number, createdAt: string): void {
    const ts = new Date(createdAt).getTime();
    const window = this.getOrCreateWindow(ts);
    window.ordersCount++;
    window.totalRevenue += totalAmount;
    window.orderCreatedAt.set(orderId, ts);
  }

  recordPayment(
    orderId: string,
    status: "SUCCESS" | "FAILED",
    processedAt: string,
  ): void {
    const ts = new Date(processedAt).getTime();
    const window = this.getOrCreateWindow(ts);

    if (status === "SUCCESS") {
      window.successCount++;
    } else {
      window.failCount++;
    }

    // Рахуємо час обробки
    for (const [, data] of this.windows) {
      if (data.orderCreatedAt.has(orderId)) {
        const createdTs = data.orderCreatedAt.get(orderId)!;
        const processingMs = ts - createdTs;
        window.totalProcessingMs += processingMs;
        window.processedCount++;
        break;
      }
    }
  }

  getCurrentStats(): {
    windowStart: string;
    ordersCount: number;
    totalRevenue: number;
    successRate: number;
    avgProcessingMs: number;
  } {
    this.evictExpiredWindows();

    // Беремо найсвіжіше вікно
    const now = Date.now();
    const currentKey = this.getWindowKey(now);
    const prevKey = this.getWindowKey(now - WINDOW_SIZE_MS);

    const current = this.windows.get(currentKey);
    const prev = this.windows.get(prevKey);

    // Агрегуємо поточне + попереднє вікно
    const combined = {
      ordersCount: (current?.ordersCount ?? 0) + (prev?.ordersCount ?? 0),
      totalRevenue: (current?.totalRevenue ?? 0) + (prev?.totalRevenue ?? 0),
      successCount: (current?.successCount ?? 0) + (prev?.successCount ?? 0),
      failCount: (current?.failCount ?? 0) + (prev?.failCount ?? 0),
      totalProcessingMs:
        (current?.totalProcessingMs ?? 0) + (prev?.totalProcessingMs ?? 0),
      processedCount:
        (current?.processedCount ?? 0) + (prev?.processedCount ?? 0),
    };

    const totalPayments = combined.successCount + combined.failCount;
    const successRate =
      totalPayments > 0 ? combined.successCount / totalPayments : 0;

    const avgProcessingMs =
      combined.processedCount > 0
        ? Math.round(combined.totalProcessingMs / combined.processedCount)
        : 0;

    return {
      windowStart:
        current?.windowStart ?? new Date(this.getWindowKey(now)).toISOString(),
      ordersCount: combined.ordersCount,
      totalRevenue: Math.round(combined.totalRevenue * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      avgProcessingMs,
    };
  }

  private evictExpiredWindows(): void {
    const cutoff = Date.now() - WINDOW_EXPIRY_MS;
    for (const [key, data] of this.windows) {
      if (new Date(data.windowStart).getTime() < cutoff) {
        this.windows.delete(key);
      }
    }
  }

  getWindowCount(): number {
    return this.windows.size;
  }
}

export const windowManager = new SlidingWindowManager();

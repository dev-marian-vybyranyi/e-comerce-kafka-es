import { Counter, Histogram, Gauge } from "prom-client";

export const paymentSuccessTotal = new Counter({
  name: "payment_success_total",
  help: "Total successful payments",
});

export const paymentFailureTotal = new Counter({
  name: "payment_failure_total",
  help: "Total failed payments",
});

export const orderProcessingDuration = new Histogram({
  name: "order_processing_duration_seconds",
  help: "Order processing duration from created to payment processed",
  buckets: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
});

export const ordersPerMinute = new Gauge({
  name: "orders_per_minute",
  help: "Number of orders in the current sliding window",
});

export const revenuePerMinute = new Gauge({
  name: "revenue_per_minute",
  help: "Total revenue in the current sliding window",
});

import { Counter, Histogram, register } from 'prom-client';

export const kafkaMessagesProduced = new Counter({
  name: 'kafka_messages_produced_total',
  help: 'Total number of messages produced to Kafka',
  labelNames: ['topic'],
});

export const kafkaMessagesConsumed = new Counter({
  name: 'kafka_messages_consumed_total',
  help: 'Total number of messages consumed from Kafka',
  labelNames: ['topic', 'groupId'],
});

export const kafkaConsumerLag = new Counter({
  name: 'kafka_consumer_errors_total',
  help: 'Total number of consumer errors',
  labelNames: ['topic', 'groupId'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export { register };

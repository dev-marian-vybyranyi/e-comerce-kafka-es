#!/bin/bash
set -e

KAFKA_HOST="kafka:29092"

echo "Waiting for Kafka to be ready..."
sleep 5

echo "Creating Kafka topics..."

kafka-topics --create --if-not-exists \
  --bootstrap-server $KAFKA_HOST \
  --topic orders \
  --partitions 3 \
  --replication-factor 1

kafka-topics --create --if-not-exists \
  --bootstrap-server $KAFKA_HOST \
  --topic payments \
  --partitions 1 \
  --replication-factor 1

kafka-topics --create --if-not-exists \
  --bootstrap-server $KAFKA_HOST \
  --topic order.status.updated \
  --partitions 1 \
  --replication-factor 1

kafka-topics --create --if-not-exists \
  --bootstrap-server $KAFKA_HOST \
  --topic orders.DLQ \
  --partitions 1 \
  --replication-factor 1

kafka-topics --create --if-not-exists \
  --bootstrap-server $KAFKA_HOST \
  --topic order-stats \
  --partitions 1 \
  --replication-factor 1

echo "Topics created:"
kafka-topics --list --bootstrap-server $KAFKA_HOST

echo "Done!"

import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: process.env.ES_NODE || "http://localhost:9200",
});

export const INDEX = process.env.ES_INDEX || "orders";

export async function ensureIndex(): Promise<void> {
  const exists = await esClient.indices.exists({ index: INDEX });

  if (exists) {
    console.log(`[ES] Index "${INDEX}" already exists`);
    return;
  }

  await esClient.indices.create({
    index: INDEX,
    mappings: {
      properties: {
        orderId: { type: "keyword" },
        userId: { type: "keyword" },
        status: { type: "keyword" },
        totalAmount: { type: "float" },
        paymentStatus: { type: "keyword" },
        courier: { type: "text" },
        createdAt: { type: "date" },
        updatedAt: { type: "date" },
        processedAt: { type: "date" },
        fullText: { type: "text" },
        items: {
          type: "nested",
          properties: {
            productId: { type: "keyword" },
            quantity: { type: "integer" },
            price: { type: "float" },
          },
        },
      },
    },
  });

  console.log(`[ES] Index "${INDEX}" created`);
}

export async function upsertOrder(
  orderId: string,
  doc: Record<string, unknown>,
): Promise<void> {
  await esClient.update({
    index: INDEX,
    id: orderId,
    doc,
    doc_as_upsert: true,
  });
}

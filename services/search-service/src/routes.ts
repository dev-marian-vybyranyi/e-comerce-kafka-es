import {
  AggregationsAggregate,
  QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";
import { Request, Response, Router } from "express";
import { esClient, INDEX } from "./elastic";

const router = Router();

// GET /search
router.get("/search", async (req: Request, res: Response) => {
  const {
    q = "",
    status,
    from,
    to,
    page = "1",
    limit = "10",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(parseInt(limit), 100);
  const offset = (pageNum - 1) * limitNum;

  const must: QueryDslQueryContainer[] = [];
  const filter: QueryDslQueryContainer[] = [];

  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: ["fullText", "orderId", "userId", "courier"],
        fuzziness: "AUTO",
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (status) {
    filter.push({ term: { status } });
  }

  if (from || to) {
    const range: Record<string, string> = {};
    if (from) range.gte = from;
    if (to) range.lte = to;
    filter.push({ range: { createdAt: range } });
  }

  try {
    const result = await esClient.search({
      index: INDEX,
      from: offset,
      size: limitNum,
      query: { bool: { must, filter } },
      highlight: {
        fields: {
          fullText: {},
          courier: {},
        },
      },
      sort: [{ createdAt: { order: "desc" } }],
    });

    const hits = result.hits.hits.map((hit) => ({
      ...(hit._source as Record<string, unknown>),
      _highlight: hit.highlight,
    }));

    return res.json({
      results: hits,
      total: (result.hits.total as { value: number }).value,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error("[Search] Query error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
});

// GET /search/orders/:id
router.get("/search/orders/:id", async (req: Request, res: Response) => {
  try {
    const result = await esClient.get({ index: INDEX, id: req.params.id });
    return res.json(result._source);
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode === 404) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(500).json({ error: "Failed to get order" });
  }
});

// GET /search/stats
router.get("/search/stats", async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  const query: QueryDslQueryContainer = userId
    ? { term: { userId } }
    : { match_all: {} };

  try {
    const result = await esClient.search({
      index: INDEX,
      size: 0,
      query,
      aggs: {
        total_revenue: { sum: { field: "totalAmount" } },
        by_status: { terms: { field: "status", size: 10 } },
        avg_amount: { avg: { field: "totalAmount" } },
      },
    });

    const aggs = result.aggregations as Record<string, AggregationsAggregate>;
    const totalRevenue = (aggs.total_revenue as { value: number }).value;
    const avgAmount = (aggs.avg_amount as { value: number }).value;
    const byStatus = (aggs.by_status as { buckets: unknown[] }).buckets;

    return res.json({
      totalOrders: (result.hits.total as { value: number }).value,
      totalRevenue,
      avgOrderAmount: avgAmount,
      byStatus,
    });
  } catch (err) {
    console.error("[Search] Stats error:", err);
    return res.status(500).json({ error: "Stats failed" });
  }
});

export default router;

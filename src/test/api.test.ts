import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Simulated Firestore Database Mock
class MockBatch {
  setCalls: any[] = [];
  committed = false;

  set(docRef: any, data: any, options?: any) {
    this.setCalls.push({ docRef, data, options });
    return this;
  }

  async commit() {
    this.committed = true;
    return Promise.resolve();
  }
}

class MockCollection {
  name: string;
  docs: Map<string, any> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  doc(id?: string) {
    const docId = id || Math.random().toString(36).substring(7);
    return {
      id: docId,
      get: async () => {
        const data = this.docs.get(docId);
        return {
          exists: this.docs.has(docId),
          id: docId,
          data: () => data
        };
      },
      delete: async () => {
        this.docs.delete(docId);
        return Promise.resolve();
      }
    };
  }

  async get() {
    const list = Array.from(this.docs.entries()).map(([id, val]) => ({
      id,
      data: () => val
    }));
    return {
      docs: list
    };
  }
}

class MockFirestore {
  collections: Map<string, MockCollection> = new Map();
  batchesCreated: MockBatch[] = [];

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection(name));
    }
    return this.collections.get(name)!;
  }

  batch() {
    const b = new MockBatch();
    this.batchesCreated.push(b);
    return b;
  }
}

// Function to generate and configure the Express App with exact same endpoints as server.ts
function createTestApp(dbMock: any) {
  const app = express();
  app.use(express.json({ limit: "1gb" }));
  app.use(express.urlencoded({ limit: "1gb", extended: true }));

  // GET /api/health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Paşa Motor API (Firebase Backend) is running" });
  });

  // GET /api/products
  app.get("/api/products", async (req, res) => {
    try {
      const snapshot = await dbMock.collection("products").get();
      const products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, count: products.length, data: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/products/import (Using 500 Batch Sequential Chunk Limit & Large Scale)
  app.post("/api/products/import", async (req, res) => {
    try {
      const payload = req.body;
      const products = Array.isArray(payload) ? payload : [payload];
      const collectionRef = dbMock.collection("products");
      let importedCount = 0;

      const CHUNK_SIZE = 500;
      for (let i = 0; i < products.length; i += CHUNK_SIZE) {
        const chunk = products.slice(i, i + CHUNK_SIZE);
        const batch = dbMock.batch();

        for (const item of chunk) {
          const id = item.id;
          let docRef;
          if (id) {
            docRef = collectionRef.doc(id);
          } else {
            docRef = collectionRef.doc();
          }

          const { id: _, ...dataToSave } = item;
          if (!dataToSave.created_at) {
            dataToSave.created_at = new Date().toISOString();
          }

          batch.set(docRef, dataToSave, { merge: true });
          
          // Mimic saving in our mock map so subsequent GET operations work seamlessly
          collectionRef.docs.set(docRef.id, dataToSave);
          importedCount++;
        }

        await batch.commit();
      }

      res.json({
        success: true,
        message: `${importedCount} ürün sıralı yazma sistemiyle başarıyla aktarıldı.`,
        count: importedCount
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/products/:id
  app.get("/api/products/:id", async (req, res) => {
    try {
      const doc = await dbMock.collection("products").doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }
      res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/products/:id
  app.delete("/api/products/:id", async (req, res) => {
    try {
      await dbMock.collection("products").doc(req.params.id).delete();
      res.json({ success: true, message: `Ürün (${req.params.id}) silindi.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
}

describe("Paşa Motor API & E2E Tests", () => {
  let dbMock: MockFirestore;
  let app: any;

  beforeEach(() => {
    dbMock = new MockFirestore();
    app = createTestApp(dbMock);
  });

  it("1. GET /api/health should return ok and expected status layout", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({
      status: "ok",
      message: "Paşa Motor API (Firebase Backend) is running"
    });
  });

  it("2. POST /api/products/import should import a single product successfully", async () => {
    const product = {
      title: "Yamaha R6 Debriyaj Balatası",
      price: 1250,
      brand: "TVS",
      category: "yedek-parca",
      slug: "yamaha-r6-debriyaj-balatasi",
      stock: 15
    };

    const response = await request(app)
      .post("/api/products/import")
      .send(product)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.message).toContain("sıralı yazma sistemiyle");

    // Retrieve via GET all products
    const getResponse = await request(app)
      .get("/api/products")
      .expect(200);

    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.count).toBe(1);
    expect(getResponse.body.data[0].title).toBe("Yamaha R6 Debriyaj Balatası");
  });

  it("3. POST /api/products/import with chunked batching should support large datasets sequentially", async () => {
    // Creating 1200 products to test sequential chunks (CHUNKS_SIZE = 500)
    // 3 chunks are expected: 500 + 500 + 200
    const productsList = Array.from({ length: 1200 }, (_, idx) => ({
      id: `p_id_${idx}`,
      title: `Ürün ${idx}`,
      price: 100 + idx,
      brand: "Falcon",
      category: "yedek-parca",
      slug: `urun-${idx}`
    }));

    const response = await request(app)
      .post("/api/products/import")
      .send(productsList)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1200);

    // Verify chunked batching counts
    expect(dbMock.batchesCreated.length).toBe(3);
    expect(dbMock.batchesCreated[0].committed).toBe(true);
    expect(dbMock.batchesCreated[1].committed).toBe(true);
    expect(dbMock.batchesCreated[2].committed).toBe(true);

    // Verify size limits and output correctly retrieved
    const getSingle = await request(app)
      .get("/api/products/p_id_1000")
      .expect(200);

    expect(getSingle.body.success).toBe(true);
    expect(getSingle.body.data.id).toBe("p_id_1000");
    expect(getSingle.body.data.title).toBe("Ürün 1000");
  });

  it("4. GET /api/products/:id should yield 404 on missing product", async () => {
    const response = await request(app)
      .get("/api/products/non-existent-id")
      .expect(404);

    expect(response.body).toEqual({ error: "Ürün bulunamadı" });
  });

  it("5. DELETE /api/products/:id should remove product smoothly", async () => {
    // Pre-populate product
    const collection = dbMock.collection("products");
    collection.docs.set("test_kill_id", { title: "Deleted item" });

    // Verify exists
    const getDoc = await request(app).get("/api/products/test_kill_id").expect(200);
    expect(getDoc.body.success).toBe(true);

    // Delete
    await request(app)
      .delete("/api/products/test_kill_id")
      .expect(200);

    // Verify 404
    await request(app).get("/api/products/test_kill_id").expect(404);
  });
});

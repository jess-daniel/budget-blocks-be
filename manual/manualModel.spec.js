const request = require("supertest");
const server = require("../data/server");
const Manual = require("./manualModel");
const db = require("../data/db-config");

describe("Manual Model", () => {
  afterAll(done => {
    return server && server.close(done);
  });

  it("Get all transactions", async () => {
    const response = await Manual.getAllTrans(1);
    expect(response).toBeDefined();
  });

  it("Manually get categories", async () => {
    const response = await Manual.MANUAL_get_categories(1);
    expect(response).toBeDefined();
  });

  it("Inserts categories", async () => {
    const body = { name: "Test category" };

    const response = await request(server)
      .post("/manual/categories/1")
      .send(body);

    expect(response).toBeDefined();
  });

  it("Inserts transactions", async () => {
    const body = {
      name: "Test name",
      amount: 44,
      payment_date: "feb 19, 2020",
      user_id: 1,
      category_id: 1
    };

    const response = await request(server)
      .post("/manual/transaction/1")
      .send(body);

    expect(response).toBeDefined();
  });
});

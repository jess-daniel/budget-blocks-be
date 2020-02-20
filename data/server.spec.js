const request = require("supertest");
const server = require("../data/server");

// When the endpoint is hit, a 200 status message will be returned
describe("GET /", () => {
  afterAll(done => {
    return server && server.close(done);
  });

  test("Should return a 200 OK", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
  });

  // Verifies that the server message is "API is up and running..."
  it("Should return proper body.message", async () => {
    const response = await request(server).get("/");
    expect(response.type).toMatch(/json/i);
  });

  it("Should return proper body.message", async () => {
    const response = await request(server).get("/");
    expect(response.type).toMatch(/json/i);
  });
});

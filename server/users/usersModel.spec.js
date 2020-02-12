const request = require("supertest");
const server = require("../data/server");
const Users = require("./users-model");
const db = require("../data/db-config");

describe("Users Model", function() {
  // Checks the response is correct
  afterAll(() => {
    server.close();
  });

  it("GET /users", async function() {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
  });

  // Ensures that the response is a json object
  it("Should return a JSON object", async function() {
    const response = await request(server).get("/");
    expect(response.type).toMatch(/json/i);
  });
});

// Checks if the response of categories of user id 1 to not be 0
it("GET /categories/:userId", async function() {
  const response = await request(server).get("/categories/1");
  expect(response.status).toBe(200);
});

// // Checks that the response to the categories is a json object
it("Should return a JSON object", async function() {
  const response = await request(server).get("/categories/1");
  expect(response.type).toMatch(/json/i);
});

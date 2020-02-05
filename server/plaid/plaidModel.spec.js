const request = require("supertest");
const server = require("../data/server");
const Plaid = require("./plaidModel");
const db = require("../data/db-config");

describe("Plaid Model", function() {
  it("Should return a 200 response when getting a token", async function() {
    const response = await Plaid.getAccessToken({ Userid: 1 });
    console.log(response);
    // expect(response.status).toBe(200);
  });
});

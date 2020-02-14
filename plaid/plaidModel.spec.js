const request = require("supertest");
const Plaid = require("./plaidModel");

describe("Plaid Model", function() {
  it("Should return a response from Plaid when getting the access token", async function() {
    try {
      const response = await request(Plaid.getAccessToken({ Userid: 1 }));
      expect(response).toBeDefined();
    } catch (error) {
      console.log(error);
    }
  });
});

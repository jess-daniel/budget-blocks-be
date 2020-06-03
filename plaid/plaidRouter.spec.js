require("dotenv").config();
const request = require("supertest");
const server = require("../server");
const axios = require("axios");

describe("PLAID end points", () => {
  describe("POST to /plaid/token_exchange/:id", () => {
    it("should return status 200", async () => {
      let publicToken = null;

      const url = "https://sandbox.plaid.com/sandbox/public_token/create";

      const requestBody = {
        public_key: process.env.PLAID_PUBLIC_KEY,
        institution_id: "ins_3",
        initial_products: ["auth"],
        options: {
          webhook: "https://www.genericwebhookurl.com/webhook",
        },
      };

      await axios.post(url, requestBody).then((res) => {
        console.log(res.data.public_token);
        publicToken = res.data.public_token;
      });

      return request(server)
        .post("/plaid/token_exchange/1")
        .send({ publicToken })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });

  describe("GET to /accessToken", () => {
    it("should return status 200 and res.body should contain data", () => {
      return request(server)
        .get("/plaid/accessToken")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toBeDefined();
        });
    });
  });

  describe("delete to /accessToken/:userId/all", () => {
    it("should return status 200 and res.body should contain message: 'All bank accounts successfully deleted!'", () => {
      return request(server)
        .delete("/plaid/accessToken/1/all")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.message).toBeDefined();
        });
    });
  });
});

require("dotenv").config();
const request = require("supertest");
const server = require("../server");
const axios = require("axios");
const db = require("../data/db-config.js");

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
        publicToken = res.data.public_token;
      });

      return request(server)
        .post("/plaid/token_exchange/1")
        .send({ publicToken })
        .then(async (res) => {
          expect(res.status).toBe(200);
          const accessToken = await db("plaid_token");
          expect(accessToken).toHaveLength(1);
        });
    });
  });

  describe("GET to /accessToken and /userTransactions/:id", () => {
    it("should return status 200 and res.body should contain data", () => {
      return request(server)
        .get("/plaid/accessToken")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toBeDefined();
          expect(res.body.data[0]).toHaveProperty("access_token");
        });
    });
  });


  describe("GET to /accessToken/:id", () => {
    it("should return status 200 and res.body should contain data for specific user", () => {
      return request(server)
        .get("/plaid/accessToken/1")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toBeDefined();
        })
    })
    it("should return status 500 and for invalid user id", () => {
      return request(server)
        .get("/plaid/accessToken/b")
        .then((res) => {
          expect(res.status).toBe(500);
        })
    })
  })

  describe("GET Request to /userTransactions/:userId", () => {
    it("should return status 200 and res.body should contain transaction information", async () => {
      return () => {
        request(server)
          .get("/plaid/userTransactions/1")
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("transactions")
            expect(res.body).toBeDefined();
          })
      }
    })
  })

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
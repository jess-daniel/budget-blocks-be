require("dotenv").config();
const request = require("supertest");
const server = require("../server");
const axios = require("axios");

describe("PLAID end point", () => {
  describe("POST to /plaid/token_exchange/:id", () => {
    it("should return status 200", async () => {
      let publicToken = null;

      const url = "https://sandbox.plaid.com/sandbox/public_token/create";

      const requestBody = {
        public_key: "7b47db1cfa540573d15cea302e5988",
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
});

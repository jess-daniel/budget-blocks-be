const request = require("supertest");
const server = require("../data/server");
const Users = require("../users/users-model");
const db = require("../data/db-config");

// describe("Users Login & Register", function() {
//   // Clears the users table when a test is ran to ensure that the db is clean
//   beforeEach(async () => {
//     await db("users").truncate();
//   });

//   it("Should allow a new user to be created", async function() {
//     // Registers a new user
//     try {
//       await Users.addUser({ email: "test@test.com", password: "password" });
//       const response = await request(server).post("/register");

//       // Checks the DB if that newly created yser exists
//       const users = await db("users");
//       expect(users).toHaveLength(1);
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   // describe("Registration", async function() {
//   //   it("Should allow a user to login", async function() {
//   //     const response = await Users.login({
//   //       email: "test@test.com",
//   //       password: "password"
//   //     });
//   //     expect(response.status).toBe(200);
//   //   });
//   // });
// });

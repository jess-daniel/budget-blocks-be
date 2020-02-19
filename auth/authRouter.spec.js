const request = require("supertest");
const server = require("../data/server");
const Users = require("../users/users-model");
const db = require("../data/db-config");

describe("Users Login & Register", () => {
  // Clears the users table when a test is ran to ensure that the db is clean
  afterAll(async () => {
    await db("users").truncate();
  });

  afterAll(done => {
    return server && server.close(done);
  });

  describe("Logs user in", () => {
    beforeAll(async () => {
      await db("users").truncate();
    });
    test("Should allow a new user to be created", async () => {
      // Registers a new user

      const testing = await Users.addUser({
        email: "test@test.com",
        password: "password"
      });

      const response = await request(server).post("/register");
      // Checks the DB if that newly created yser exists
      const users = await db("users");
      expect(users).toHaveLength(1);
    });
  });

  test("Should allow a user to login", async () => {
    const user = { email: "test@test.com", password: "password" };

    // await Users.login(user);
    const response = await request(server)
      .post("/api/auth/login")
      .send(user);
    // console.log(response);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("Should return an error if no body is passed in", async () => {
    const response = await request(server).post("/api/auth/login");

    expect(response.body.error).toBe(
      "No information was passed into the body."
    );
  });

  test("Should return an error if the user does not exist", async () => {
    const user = { email: "fake@test.com", password: "password" };

    // await Users.login(user);
    const response = await request(server)
      .post("/api/auth/login")
      .send(user);
    // console.log(response);

    expect(response.status).toBe(500);
    expect(response.status).toBeDefined();
    expect(response.body.message).toBe(
      "Unable to find the user by the email provided "
    );
  });
});

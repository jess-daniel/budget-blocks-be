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
      // Registers a new user;

      const user = { email: "test@test.com", password: "password" };
      const response = await request(server)
        .post("/api/auth/register")
        .send(user);

      expect(response.status).toBe(201);
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

  test("Should return an error if body is missing", async () => {
    const response = await request(server).post("/api/auth/login");

    expect(response.body.error).toBe(
      "No information was passed into the body."
    );
  });

  test("Should return an error if no email is provided", async () => {
    const user = { password: "password" };

    // await Users.login(user);
    const response = await request(server)
      .post("/api/auth/login")
      .send(user);
    // console.log(response);

    expect(response.status).toBe(400);
    expect(response.status).toBeDefined();
    expect(response.body.error).toBe("Please provide an email.");
  });

  test("Should return an error if no password is provided", async () => {
    const user = { email: "test@test.com" };

    // await Users.login(user);
    const response = await request(server)
      .post("/api/auth/login")
      .send(user);
    // console.log(response);

    expect(response.status).toBe(400);
    expect(response.status).toBeDefined();
    expect(response.body.error).toBe("Please provide a password.");
  });

  test("Should return an error if no token is passed in", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "You must be logged in to access this information."
    );
  });

  test("Should return a list of users", async () => {
    const response = await Users.allUsers();

    expect(response).toBeDefined();
  });
});

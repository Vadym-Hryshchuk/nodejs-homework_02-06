require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

mongoose.set("strictQuery", false);

const { DB_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_URI);
  });
  const user = {
    email: "qwerty@ukr.net",
    password: "qwerty",
  };
  test("should login user", async () => {
    const response = await supertest(app).post("/users/login").send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty(
      "user",
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });
});

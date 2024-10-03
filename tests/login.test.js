import "dotenv/config";
import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import appTest from "../appTest.js";
import User from "../models/user.js";

mongoose.set("strictQuery", false);

const { DB_URI_TEST } = process.env;

describe("User login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany();
    const hashedPassword = await bcrypt.hash("1234567890", 10);
    const testUser = await User.create({
      email: "testUser@gmail.com",
      password: hashedPassword,
    });
    await testUser.save();
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_URI_TEST);
  });
  it("should login user and return status code 200", async () => {
    const response = await supertest(appTest).post("/users/login").send({
      email: "testUser@gmail.com",
      password: "1234567890",
    });
    expect(response.statusCode).toBe(200);
  });
  it("should login user and return token", async () => {
    const response = await supertest(appTest).post("/users/login").send({
      email: "testUser@gmail.com",
      password: "1234567890",
    });
    expect(response.body.token).toBeDefined();
  });
  it("should login user and returt two fieds: email (data type String) and subscription (data type String)", async () => {
    const response = await supertest(appTest).post("/users/login").send({
      email: "testUser@gmail.com",
      password: "1234567890",
    });
    expect(response.body.user.email).toBeDefined();
    expect(typeof response.body.user.email).toBe("string");
    expect(response.body.user.subscription).toBeDefined();
    expect(typeof response.body.user.subscription).toBe("string");
  });
});

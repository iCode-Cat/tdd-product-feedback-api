const {set} = require("mongoose");
const request = require("supertest");
const makeDB = require("../src/makeDB");
require("dotenv").config();
const server = require("../src/makeExpressServer");
const User = require("../src/models/userSchema");
let email;
let token;

jest.setTimeout(50000);

// var token = null;

// before(function(done) {
//   request(url)
//     .post('/user/token')
//     .send({ _id: user1._id, password: user1.password })
//     .end(function(err, res) {
//       token = res.body.token; // Or something
//       done();
//     });
// });

beforeAll(() => {
  makeDB({config: process.env});
  email = "test" + Date.now() + "@test.com";
});

afterAll(async () => {
  await User.deleteOne({email});
  server.close();
});

describe("User Authentication", () => {
  it("POST /user/register --> register user and send JWT", async () => {
    return request(server)
      .post("/user/register")
      .send({
        email,
        password: "232323"
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        token = response.body.token;
        expect(response.body).toEqual(
          expect.objectContaining({
            token: expect.stringMatching(/ey/)
          })
        );
      });
  });

  it("DB --> Saving user successfully after register", async () => {
    const user = await User.findOne({email});
    expect(user).not.toBe(null);
  });

  it("POST /user/login --> login user by JWT", async () => {
    return request(server)
      .post("/user/login")
      .send({
        email,
        password: "232323"
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            token: expect.stringMatching(/ey/)
          })
        );
      });
  });
  it("POST /user/login --> throw error on wrong password", async () => {
    return request(server).post("/user/login").send({email, password: "asdfghj"}).expect(400);
  });
  it("POST /user/login --> throw error on wrong email", async () => {
    return request(server)
      .post("/user/login")
      .send({email: "dumbmail@gmail.com", password: "asdfghj"})
      .expect(400);
  });
  it("GET /user/me--> middleware protecting the routes if no valid token", async () => {
    return request(server).get("/user/me").expect(401);
  });
  it("GET /user/me--> middleware allow the users with valid token", async () => {
    return request(server)
      .get("/user/me")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            email
          })
        );
        // Don't include password in response
        expect(response.body.password).toBe(undefined);
      });
  });
});

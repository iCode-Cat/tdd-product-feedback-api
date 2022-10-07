const {response} = require("express");
const {set} = require("mongoose");
const request = require("supertest");
const makeDB = require("../src/makeDB");
require("dotenv").config();
const server = require("../src/makeExpressServer");
const Feedback = require("../src/models/feedbackSchema");
const User = require("../src/models/userSchema");

let email;
let token;
let feedbackId;

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
  await Feedback.deleteOne({_id: feedbackId});
  server.close();
});

describe("User Authentication API", () => {
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
    return expect(user).not.toBe(null);
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
  it("GET /user/me--> middleware allows the users with valid token", async () => {
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

describe("Feedback API", () => {
  it("POST /feedback --> create new feedback", () => {
    return request(server)
      .post("/feedback")
      .send({
        title: "Test Feedback",
        category: "feature",
        details: "Lorem Ipsum Alamemun Bubujus jujus"
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .set("Authorization", token)
      .then(response => {
        feedbackId = response.body._id;
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            title: expect.any(String),
            category: expect.any(String),
            details: expect.any(String),
            status: "planned",
            user: expect.any(String),
            vote: expect.any(Number)
          })
        );
      });
  });

  it("POST /feedback --> throw error if one of the field is empty", () => {
    return request(server)
      .post("/feedback")
      .send({
        category: "feature",
        details: "Lorem Ipsum Alamemun Bubujus jujus"
      })
      .set("Authorization", token)
      .expect(400);
  });

  it("POST /feedback --> throw error on wrong category", () => {
    return request(server)
      .post("/feedback")
      .send({
        title: "Test Feedback",
        category: "TEST",
        details: "Lorem Ipsum Alamemun Bubujus jujus"
      })
      .set("Authorization", token)
      .expect(400);
  });

  it("GET /feedback --> get all feedbacks", async () => {
    return request(server)
      .get("/feedback")
      .expect(200)
      .expect("Content-Type", /json/)
      .set("Authorization", token)
      .then(response => {
        expect(response.body).toEqual(expect.arrayContaining([]));
      });
  });

  it("GET /feedback/:id --> get a feedback by id", async () => {
    return request(server)
      .get("/feedback/" + feedbackId)
      .expect(200)
      .expect("Content-Type", /json/)
      .set("Authorization", token)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: feedbackId,
            vote: expect.any(Number)
          })
        );
      });
  });

  it("PUT /feedback --> edit existing feedback", async () => {
    return request(server)
      .put("/feedback")
      .send({
        id: feedbackId,
        title: "Updated",
        category: "Updated",
        details: "updated",
        status: "in-progress"
      })
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response =>
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: feedbackId,
            title: "Updated",
            category: "Updated",
            details: "updated",
            status: "in-progress"
          })
        )
      );
  });

  it("POST /feedback/upvote --> increment vote", async () => {
    return request(server)
      .post({
        id: feedbackId
      })
      .expect(200)
      .set("Authorization", token)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            vote: expect.toBe(1)
          })
        );
      });
  });

  it("POST /feedback/downvote --> decrement vote", async () => {
    return request(server)
      .post({
        id: feedbackId
      })
      .expect(200)
      .set("Authorization", token)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            vote: expect.toBe(0)
          })
        );
      });
  });

  it("DELETE /feedback --> delete a feedback", async () => {
    await request(server)
      .delete("/feedback")
      .send({
        id: feedbackId
      })
      .set("Authorization", token)
      .expect(200);
    const item = await Feedback.findById(feedbackId);
    return expect(item).toBe(null);
  });
});

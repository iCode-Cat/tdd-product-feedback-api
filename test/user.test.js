const request = require("supertest");
const makeDB = require("../src/makeDB");
require("dotenv").config();
const server = require("../src/makeExpressServer");
let email;

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

describe("User Authentication", () => {
  it("POST /user/register --> register user and send JWT", async () => {
    return request(server)
      .post("/user/register")
      .send({
        email: "juju33@gmail.com",
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

  // it("POST /user/login --> login user by JWT", async () => {
  //   return request(server)
  //     .post("/user/login")
  //     .send({
  //       email,
  //       password: "123"
  //     })
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .then(response => {
  //       expect(response.body).toEqual(
  //         expect.objectContaining({
  //           token: expect.stringMatching(/ey/)
  //         })
  //       );
  //     });
  // });
});

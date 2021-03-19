const request = require("supertest");
const app = require("../app");
const generateToken = require("../helpers/jwt");
const { User, sequelize } = require("../models/index");

let access_token = "";

beforeAll(() => {
  access_token = generateToken({
    id: 1,
    email: "admin@mail.com",
  });
});

afterAll((done) => {
  User.destroy({ where: {} })
    .then(() => {
      sequelize.close();
      done();
    })
    .catch((err) => {
      done(err);
    });
});

// Login User
describe("Login user, route = /login", function () {
  it("200 success login", function (done) {
    let body = {
      email: "admin@mail.com",
      password: "1234",
    };

    request(app)
      .post("/users/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("access_token");
        expect(typeof res.body.access_token).toEqual("string");
        done();
      });
  });

  it("400 failed login - wrong password", function (done) {
    let body = {
      email: "admin@mail.com",
      password: "7654321",
    };

    request(app)
      .post("/users/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });

  it("404 failed login - email not found", function (done) {
    let body = {
      email: "hacktiv@mail.com",
      password: "1234567",
    };

    request(app)
      .post("/users/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });

  it("400 failed login - email and password are empty", function (done) {
    let body = {
      email: "",
      password: "",
    };

    request(app)
      .post("/users/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });
});

// users register
describe.only("register user, route = /users/register", () => {
  it("201 success register", function (done) {
    let body = {
      username: "admin",
      email: "admin@mail.com",
      password: "12345678",
    };

    request(app)
      .post("/users/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("id");
        expect(typeof res.body.id).toEqual("number");
        done();
      });
  });

  it("400 failed register - password is empty", function (done) {
    let body = {
      username: "admin",
      email: "admin@mail.com",
      password: "",
    };

    request(app)
      .post("/users/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });

  it("400 failed register - email is empty", function (done) {
    let body = {
      username: "admin",
      email: "",
      password: "1234567",
    };

    request(app)
      .post("/users/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });

  it("400 failed register - email format is not correct", function (done) {
    let body = {
      username: "admin",
      email: "hacktiv.com",
      password: "1234567",
    };

    request(app)
      .post("/users/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });

  it("400 failed register - email and password are empty", function (done) {
    let body = {
      username: "admin",
      email: "",
      password: "",
    };

    request(app)
      .post("/users/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(typeof res.body.error).toEqual("string");
        done();
      });
  });
});

//users leader board
describe("leaderboard user, route = /users/leaderboard", function () {
  it("200 success read users data", function (done) {
    request(app)
      .get("/users/leaderboard")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        done();
      });
  }),
    it("401 failed read users - access token not found", function (done) {
      request(app)
        .get("/users/leaderboard")
        // .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("error");
          expect(typeof res.body.error).toEqual("string");
          done();
        });
    });
});

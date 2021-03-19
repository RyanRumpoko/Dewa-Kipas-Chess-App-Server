const request = require("supertest");
const app = require("../app");
const generateToken = require("../middlewares/authenticate");

let access_token = "";

beforeAll(() => {
  access_token = generateToken({
    id: 1,
    email: "admin@mail.com",
    role: "admin",
  });
});

describe("add history route = /histories", function () {
  it("201 success add history", function (done) {
    let body = {
      playerOne: 2,
      playerTwo: 2,
      status: 1,
    };

    request(app)
      .post("/histories")
      .set("access_token", access_token)
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("playerOne");
        expect(res.body).toHaveProperty("playerTwo");
        expect(res.body).toHaveProperty("status");

        expect(typeof res.body).toEqual("object");
        expect(typeof res.body.id).toEqual("number");
        expect(typeof res.body.playerOne).toEqual("number");
        expect(typeof res.body.playerTwo).toEqual("number");
        expect(typeof res.body.status).toEqual("number");
        done();
      });
  });

  it("400 failed add history - without access token", function (done) {
    const body = {
      playerOne: 2,
      playerTwo: 2,
      status: 1,
    };

    request(app)
      .post("/histories")
      // .set('access_token',access_token)
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

  it("400 failed add history - empty player", function (done) {
    const body = {
      playerOne: null,
      playerTwo: null,
      status: 1,
    };

    request(app)
      .post("/histories")
      .set("access_token", access_token)
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

  it("400 failed add history - empty player one", function (done) {
    const body = {
      playerOne: null,
      playerTwo: 2,
      status: 1,
    };

    request(app)
      .post("/histories")
      .set("access_token", access_token)
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

  it("400 failed add history - empty player two", function (done) {
    const body = {
      playerOne: 1,
      playerTwo: null,
      status: 1,
    };

    request(app)
      .post("/histories")
      .set("access_token", access_token)
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

  it("400 failed add history - empty status", function (done) {
    const body = {
      playerOne: 1,
      playerTwo: 2,
      status: null,
    };

    request(app)
      .post("/histories")
      .set("access_token", access_token)
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

describe("read history by id route = /histories/:id", function () {
  it("200 success read history by id player", function (done) {
    request(app)
      .get(`/histories/${1}`)
      .set("access_token", access_token)
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        done();
        done();
      });
  });

  it("400 failed read history - without access token", function (done) {
    const body = {
      playerOne: 2,
      playerTwo: 2,
      status: 1,
    };

    request(app)
      .get(`/histories/${1}`)
      // .set('access_token',access_token)
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

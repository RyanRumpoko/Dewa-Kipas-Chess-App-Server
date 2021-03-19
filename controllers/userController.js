const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const generateToken = require('../helpers/jwt')
class UserController {
  static register(req, res, next) {
    const { username, email, password } = req.body;
    User.create({
      username,
      email,
      password,
    })
      .then((user) =>
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          pictureUrl: user.pictureUrl,
        })
      )
      .catch((err) => next(err));
  }
  static login(req, res, next) {
    const { email, password } = req.body;
    if (!email) throw { name: "INVALID_DATA", message: "Email Required!" };
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (!user)
          throw { name: "INVALID_DATA", message: "invalid email/password" };
        if (!password)
          throw { name: "INVALID_DATA", message: "Password Required!" };
        const match = comparePassword(password, user.password);
        if (!match)
          throw { name: "INVALID_DATA", message: "invalid email/password" };
        const access_token = generateToken({
          id: user.id,
          username: user.username,
          email: user.email,
          pictureUrl: user.pictureUrl,
          eloRating: user.eloRating,
        });
        res
          .status(200)
          .json({ username: user.username, email: user.email, access_token });
      })
      .catch((err) => next(err));
  }
  static getLeaderboard(req, res, next) {
    User.findAll()
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
  }
}

module.exports = UserController;

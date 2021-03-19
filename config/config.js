let env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  require("dotenv").config();
}

module.exports = {
  development: {
    username: process.env.DEV_USER_DB,
    password: process.env.DEV_PASS_DB,
    database: "dewa-kipas-db",
    host: "localhost",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

const Sequelize = require("sequelize");

const db: String = process.env.DB_NAME;
const username: String = process.env.DB_USERNAME;
const password: String = process.env.DB_PASSWORD;
console.log(db, username, password);

export const sequelize = new Sequelize(db, username, password, {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("database connected successfully"))
  .catch((err: Error) => console.log("something went rong with database connection"));

import knex from "knex";

const databaseName = process.env.DB_NAME || "snapcrud_generic";

const knexDbInit = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "3306") || 3306,
    user: process.env.DB_USER || "root",
  },
  pool: { max: 10, min: 0 },
});

await knexDbInit.raw("CREATE DATABASE IF NOT EXISTS " + databaseName);
await knexDbInit.destroy();

export default knex({
  client: "mysql2",
  connection: {
    database: databaseName,
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "3306") || 3306,
    user: process.env.DB_USER || "root",
  },
  pool: { max: 10, min: 0 },
});

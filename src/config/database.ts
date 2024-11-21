import knex from "knex";

const databaseName = process.env.SNAPCRUD_DB_NAME || "snapcrud_generic";

const knexDbInit = knex({
  client: "mysql2",
  connection: {
    host: process.env.SNAPCRUD_DB_HOST || "localhost",
    password: process.env.SNAPCRUD_DB_PASSWORD || "",
    port: parseInt(process.env.SNAPCRUD_DB_PORT || "3306") || 3306,
    timezone: "UTC",
    user: process.env.SNAPCRUD_DB_USER || "root",
  },
  pool: { max: 10, min: 0 },
});

await knexDbInit.raw("CREATE DATABASE IF NOT EXISTS " + databaseName);
await knexDbInit.destroy();

export default knex({
  client: "mysql2",
  connection: {
    database: databaseName,
    host: process.env.SNAPCRUD_DB_HOST || "localhost",
    password: process.env.SNAPCRUD_DB_PASSWORD || "",
    port: parseInt(process.env.SNAPCRUD_DB_PORT || "3306") || 3306,
    timezone: "UTC",
    user: process.env.SNAPCRUD_DB_USER || "root",
  },
  pool: { max: 10, min: 0 },
});

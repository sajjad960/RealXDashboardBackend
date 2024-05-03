import * as fs from "fs";
import * as mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

// Function to read and execute queries from a file
const executeQueriesFromFile = (
  filename: string,
  connection: mysql.PoolConnection
) => {
  const sqlContent = fs.readFileSync(`${__dirname}/${filename}`, "utf-8");
  const queries = sqlContent.split(";");

  queries.forEach((query) => {
    if (query.trim() !== "") {
      connection.query(query, (err, results) => {
        if (err) throw err;
        console.log("Query executed successfully");
      });
    }
  });
  // Release the connection back to the pool
  connection.release();

  // Close the pool
  pool.end();
};

// Create a pool for database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "mysql", // Use a default database to establish the connection
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Acquire a connection from the pool
pool.getConnection((err, connection) => {
  if (err) throw err;
  // Create and use the database
  connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    (err) => {
      if (err) throw err;

      connection.query(`USE ${process.env.DB_NAME}`, (err) => {
        if (err) throw err;

        // Execute each query one by one
        // Execute the dump file
        const dumpFileName = "feedManagementSeed.sql"; // Change this to your dump file name
        executeQueriesFromFile(dumpFileName, connection);
      });
    }
  );
});

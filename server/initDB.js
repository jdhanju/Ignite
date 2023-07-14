import pg from 'pg';
import dotenv from 'dotenv';
import { Connector } from '@google-cloud/cloud-sql-connector';
dotenv.config();

// Google Cloud SQL connector
const connector = new Connector();

const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.GCP_CLOUD_SQL_INSTANCE_CONNECTION_NAME,
  ipType: 'PUBLIC', 
});

const client = new pg.Client({
  ...clientOpts,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
});

const createDatabase = async () => {
  await client.connect();
  await client.query("CREATE DATABASE dateplanner");
  await client.end();
};

const createTables = async () => {
  const pool = new pg.Pool({
    ...clientOpts,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "dateplanner"
  });

  await pool.query(`
    CREATE TABLE locations(
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      city text,
      country text
    );
  `);

  await pool.query(`
    CREATE TABLE users(
      id serial PRIMARY KEY,
      username varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      password_salt varchar(255) NOT NULL,
      avatar_URL text
    );
  `);

  await pool.query(`
    CREATE TABLE events(
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,
      description text,
      location_id integer,
      price varchar(255),
      category varchar(255),
      preferred_time varchar(255),
      author varchar(255),
      date_posted DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    );
  `);

  await pool.end();
};

const createSchema = async () => {
  try {
    await createDatabase();
    await createTables();
    console.log("Schema creation successful!");
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

createSchema();

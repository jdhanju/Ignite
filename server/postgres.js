import pg from 'pg';
import dotenv from "dotenv";
import { Connector } from "@google-cloud/cloud-sql-connector"
dotenv.config();

// Google Cloud SQL connector
const connector = new Connector();

const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.GCP_CLOUD_SQL_INSTANCE_CONNECTION_NAME,
  ipType: 'PUBLIC', 
});

const pool = new pg.Pool({
  ...clientOpts,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "dateplanner"
});

export default pool;
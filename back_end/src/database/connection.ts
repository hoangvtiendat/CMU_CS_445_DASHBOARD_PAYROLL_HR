import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: 'root',
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default connection;

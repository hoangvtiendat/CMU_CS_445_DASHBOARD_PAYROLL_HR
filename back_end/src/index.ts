import express, { Express, Request, Response, NextFunction } from "express";
import apiRouter from "./api/index";
import { MSSQLDataSource, MySQLDataSource } from "./config/typeorm.config";

import { pino } from "pino";
// import { seedData } from "./config/seeder";

import cors from "cors";
import './scheduler/attendance.cron'; 

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.30.127:3000"], // Chỉ cho phép frontend này truy cập
  credentials: true, // Nếu dùng cookie hoặc token
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


// const app: Express = express();
const port = 3001;
app.use(express.json());

const logger = pino({ name: "server start" });

async function startApp() {
  try {
    await MySQLDataSource.initialize();
    logger.info("MySQL Datasource has been initialized!");

    await MSSQLDataSource.initialize();
    logger.info("MSSQL Datasource has been initialized!");
  } catch (error) {
    const errorMessage = `Error during Data Source initialization:, ${(error as Error).message
      }`;
    logger.error(errorMessage);
  }
}
startApp();


app.use('/api', apiRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

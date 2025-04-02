import express, { Express, Request, Response, NextFunction } from "express";
import apiRouter  from "./api/index";
// import dataSource from "./config/typeorm.config";
import { pino } from "pino";
// import { seedData } from "./config/seeder";

const app: Express = express();
const port = 3001;
app.use(express.json());

const logger = pino({ name: "server start" });

async function startApp() {
  try {
    // await dataSource.initialize();
    logger.info("Data Source has been initialized!");

    // await seedData(dataSource);
  } catch (error) {
    const errorMessage = `Error during Data Source initialization:, ${
      (error as Error).message
    }`;
    logger.error(errorMessage);
  }
}
startApp();


// app.use('/api', apiRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

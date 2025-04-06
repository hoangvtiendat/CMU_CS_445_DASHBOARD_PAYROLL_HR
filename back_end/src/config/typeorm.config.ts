import {config} from 'dotenv';
import  {join} from 'path';
import {DataSource} from 'typeorm';
import { Account } from '../model/account.entity';
import { Employee } from '../model/employee.entity';
import { Attendance } from '../model/attendance.entity';
import { Department } from '../model/department.entity';
import { Position } from '../model/position.entity';

config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Account, Employee, Attendance, Department, Position],  
  synchronize: false,
  logging: true,
});

export default AppDataSource; 



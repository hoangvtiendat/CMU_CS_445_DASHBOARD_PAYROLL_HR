import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { MySQLAccount } from '../model/mysql/account.entity';
import { MySQLEmployee } from '../model/mysql/employee.entity';
import { MySQLAttendance } from '../model/mysql/attendance.entity';
import { MySQLDepartment } from '../model/mysql/department.entity';
import { MySQLPosition } from '../model/mysql/position.entity';
import { MSSQLDepartment } from '../model/mssql/department.entity';
import { MSSQLEmployee } from '../model/mssql/employee.entity';
import { MSSQLPosition } from '../model/mssql/position.entity';
import 'reflect-metadata';

config();

const MySQLDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [MySQLAccount, MySQLEmployee, MySQLAttendance, MySQLDepartment, MySQLPosition],
  synchronize: false,
  logging: true,
});

const MSSQLDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: 'Tiendat@123',
  database: 'HUMAN',
  synchronize: false,
  logging: false,
  entities: [MSSQLDepartment, MSSQLEmployee, MSSQLPosition],
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
});

export { MySQLDataSource, MSSQLDataSource };



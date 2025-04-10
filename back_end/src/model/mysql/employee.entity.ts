import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import {MySQLDepartment} from './department.entity'
import {MySQLPosition} from './position.entity'

@Entity({ name: 'employees', schema: 'HUMAN_PAYROLL' }) 
export class MySQLEmployee {
  @PrimaryGeneratedColumn()
  public EmployeeID!: number; // INT AUTO_INCREMENT

  @Column({ type: 'varchar', length: 255})
  public FullName!: string; // VARCHAR(255) UNIQUE NOT NULL

  @ManyToOne(() => MySQLDepartment)
  @JoinColumn({ name: 'DepartmentID' }) // Tên cột khóa ngoại trong bảng Employees
  public Department!: MySQLDepartment;

  @ManyToOne(() => MySQLPosition)
  @JoinColumn({ name: 'PositionID' })
  public Position!: MySQLPosition;

  @Column({ type: 'varchar', length: 255 })
  public Status!: string; // VARCHAR(255) NOT NULL
}

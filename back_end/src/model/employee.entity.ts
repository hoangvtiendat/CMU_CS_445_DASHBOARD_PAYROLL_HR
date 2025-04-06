import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import {Department} from './department.entity'
import {Position} from './position.entity'
@Entity({ name: 'Employees', schema: 'HUMAN_PAYROLL' }) 
export class Employee {
  @PrimaryGeneratedColumn()
  public EmployeeID!: number; // INT AUTO_INCREMENT

  @Column({ type: 'varchar', length: 255})
  public FullName!: string; // VARCHAR(255) UNIQUE NOT NULL

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'DepartmentID' }) // Tên cột khóa ngoại trong bảng Employees
  public Department!: Department;

  @ManyToOne(() => Position)
  @JoinColumn({ name: 'PositionID' })
  public Position!: Position;

  @Column({ type: 'varchar', length: 255 })
  public Status!: string; // VARCHAR(255) NOT NULL
}

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
//   ManyToOne,
//   ManyToMany,
//   Int32,
//   JoinTable,
// } from 'typeorm';
// import { DateTimeEntity } from './base/datetime.entity';


// @Entity()
// export class User extends DateTimeEntity {
//   @PrimaryGeneratedColumn('uuid')
//   public id!: string;

//   @Column({ type: 'varchar', unique: true, length: 255 })
//   public username!: string;

//   @Column({ type: 'varchar', length: 255 })
//   public password!: string;
// }


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity'
@Entity({ name: 'ACCOUNT', schema: 'HUMAN_PAYROLL' }) // Đảm bảo tên bảng đúng
export class Account {
  @PrimaryGeneratedColumn()
  public Id!: number; // INT AUTO_INCREMENT

  @Column({ type: 'varchar', length: 255, unique: true })
  public Username!: string; // VARCHAR(255) UNIQUE NOT NULL

  @Column({ type: 'varchar', length: 255, unique: true })
  public Email!: string; // VARCHAR(255) UNIQUE NOT NULL

  @Column({ type: 'varchar', length: 255 })
  public FullName!: string; // VARCHAR(255) UNIQUE NOT NULL

  @Column({ type: 'varchar', length: 255 })
  public Password!: string; // VARCHAR(255) NOT NULL

  @Column({ type: 'varchar', length: 255 })
  public Role!: string; // VARCHAR(255) NOT NULL

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'EmployeeID' })
  public Employee!: Employee;


  @Column({ type: 'varchar', length: 255, nullable: true })
  public Reset_token?: string | null; // VARCHAR(255) DEFAULT NULL

  @Column({ type: 'varchar', length: 255, nullable: true })
  public Access_token?: string | null; // VARCHAR(255) DEFAULT NULL

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public Created_at!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public Updated_at!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

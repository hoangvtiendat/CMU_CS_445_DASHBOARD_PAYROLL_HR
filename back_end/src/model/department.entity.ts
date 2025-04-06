
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'Dapartment', schema: 'HUMAN_PAYROLL' }) // Đảm bảo tên bảng đúng
export class Department {
  @PrimaryGeneratedColumn()
  public DepartmentID!: number; // INT AUTO_INCREMENT

  @Column({ type: 'varchar', length: 255, unique: true })
  public DepartmentName!: string; // VARCHAR(255) UNIQUE NOT NULL


 
}

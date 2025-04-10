
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'Positions', schema: 'HUMAN_PAYROLL' }) // Đảm bảo tên bảng đúng
export class MySQLPosition {
  @PrimaryGeneratedColumn()
  public PositionID!: number; 

  @Column({ type: 'varchar', length: 255, unique: true })
  public PositionName!: string; 


 
}

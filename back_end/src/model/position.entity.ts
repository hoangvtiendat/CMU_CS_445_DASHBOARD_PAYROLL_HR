
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'Position', schema: 'HUMAN_PAYROLL' }) // Đảm bảo tên bảng đúng
export class Position {
  @PrimaryGeneratedColumn()
  public PositionID!: number; 

  @Column({ type: 'varchar', length: 255, unique: true })
  public PositionName!: string; 


 
}

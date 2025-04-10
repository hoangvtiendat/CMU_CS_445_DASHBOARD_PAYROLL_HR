
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'Positions', schema: 'dbo' }) // Đảm bảo tên bảng đúng
export class MSSQLPosition {
    @PrimaryGeneratedColumn()
    public PositionID!: number;

    @Column({ type: 'nvarchar', length: 100, unique: true })
    public PositionName!: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public CreatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    @UpdateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public UpdatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


}

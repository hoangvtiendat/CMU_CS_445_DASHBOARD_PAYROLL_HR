
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'Departments', schema: 'dbo' }) // Đảm bảo tên bảng đúng
export class MSSQLDepartment {
    @PrimaryGeneratedColumn()
    public DepartmentID!: number; // INT AUTO_INCREMENT

    @Column({ type: 'nvarchar', length: 100, unique: true })
    public DepartmentName!: string; // VARCHAR(255) UNIQUE NOT NULL

    @CreateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public CreatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    @UpdateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public UpdatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


}

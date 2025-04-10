import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MSSQLDepartment } from './department.entity'
import { MSSQLPosition } from './position.entity'
@Entity({ name: 'Employees', schema: 'dbo' })
export class MSSQLEmployee {
    @PrimaryGeneratedColumn()
    public EmployeeID!: number; // INT AUTO_INCREMENT

    @Column({ type: 'nvarchar', length: 100 })
    public FullName!: string;

    @Column({ type: 'date' })
    public DateOfBirth!: Date;

    @Column({ type: 'nvarchar', length: 10 })
    public Gender!: string;

    @Column({ type: 'nvarchar', length: 15 })
    public PhoneNumber!: string;

    @Column({ type: 'nvarchar', length: 100,  nullable: true  })
    public Email!: string;

    @Column({ type: 'date' })
    public HireDate!: Date; // VARCHAR(255) UNIQUE NOT NULL

    @ManyToOne(() => MSSQLDepartment)
    @JoinColumn({ name: 'DepartmentID' }) // Tên cột khóa ngoại trong bảng Employees
    public Department!: MSSQLDepartment;

    @ManyToOne(() => MSSQLPosition)
    @JoinColumn({ name: 'PositionID' })
    public Position!: MSSQLPosition;

    @Column({ type: 'nvarchar', length: 50 })
    public Status!: string; // VARCHAR(255) NOT NULL

    @CreateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public CreatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    @UpdateDateColumn({ type: 'datetime', default: () => 'getdate()', onUpdate: 'getdate()' })
    public UpdatedAt!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

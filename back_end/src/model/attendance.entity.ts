import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
@Entity({ name: 'Employees', schema: 'HUMAN_PAYROLL' })
export class Attendance {
    @PrimaryGeneratedColumn()
    public AttendaceID!: number; // INT AUTO_INCREMENT

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'EmployeeID' })
    public Employee!: Employee;

    @Column({ type: 'int'})
    public WorkDays!: number;

    @Column({ type: 'int'})
    public AbsentDays!: number;

    @Column({ type: 'int'})
    public LeaveDays!: number;

    @Column({ type: 'date'})
    public AttendanceMonth!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public CreateAt!: Date;
}

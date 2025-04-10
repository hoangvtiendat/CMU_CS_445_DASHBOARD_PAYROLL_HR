import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MySQLEmployee } from './employee.entity';
@Entity({ name: 'attendance', schema: 'HUMAN_PAYROLL' })
export class MySQLAttendance {
    @PrimaryGeneratedColumn()
    public AttendaceID!: number; // INT AUTO_INCREMENT

    @ManyToOne(() => MySQLEmployee)
    @JoinColumn({ name: 'EmployeeID' })
    public Employee!: MySQLEmployee;

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

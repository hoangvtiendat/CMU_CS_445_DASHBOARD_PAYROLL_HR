import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { MySQLEmployee } from './employee.entity';

@Entity({ name: 'Salaries', schema: 'HUMAN_PAYROLL' })
export class Salary {
    @PrimaryGeneratedColumn()
    public SalaryID!: number; // INT AUTO_INCREMENT

    @ManyToOne(() => MySQLEmployee)
    @JoinColumn({ name: 'EmployeeID' })
    public Employee!: MySQLEmployee;

    @Column({ type: 'date'})
    public SalaryMonth!: Date;

    @Column({ type: 'int'})
    public BaseSalary!: number;

    @Column({ type: 'int'})
    public Bonus!: number;

    @Column({ type: 'int'})
    public Deductions!: number;

    @Column({ type: 'int'})
    public NetSalary!: number;


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public CreatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    calculateNetSalary() {
        this.NetSalary = this.BaseSalary + this.Bonus - this.Deductions;
    }
}

import { Employee } from '../../model/employee.entity';
import dataSource from '../../config/typeorm.config';



export const userRepository = dataSource.getRepository(Employee).extend({
    async findAllAsync(): Promise<Employee[]> {
        return this.find();
    },

    async findByIdAsync(id: number): Promise<Employee | null> {
        return this.findOneBy({ EmployeeID: id });
    },

    async createUserAsync(userData: Partial<Employee>): Promise<Employee> {
        const newUser = this.create(userData);
        return this.save(newUser);
    },

    
    
    async updateUserAsync(
        id: number,
        updateData: Partial<Employee>
    ): Promise<Employee | null> {
        await this.update(id, updateData);
        return this.findOneBy({ EmployeeID: id });
    },

    async getAll() : Promise<Employee[] | null>{
        return this.find();
    }

});

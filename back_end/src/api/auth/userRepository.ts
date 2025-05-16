import { MySQLAccount } from '../../model/mysql/account.entity';

import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';

const mysqlRepository = MySQLDataSource.getRepository(MySQLAccount);

export const userRepository = MySQLDataSource.getRepository(MySQLAccount).extend({
    async findAllAsync(): Promise<MySQLAccount[]> {
        return this.find();
    },

    async findByIdAsync(id: number): Promise<MySQLAccount | null> {
        return this.findOneBy({ Id: id });
    },

    async createUserAsync(userData: Partial<MySQLAccount>): Promise<(MySQLAccount & { Employee: { EmployeeID: number; FullName: string } }) | null> {
        // Tạo người dùng mới
        const newUser = this.create(userData);
        await this.save(newUser);

        // Lấy thông tin người dùng vừa tạo, bao gồm thông tin Employee
        const createdUser = await this.createQueryBuilder('account')
            .leftJoinAndSelect('Employees', 'employee', 'account.EmployeeID = employee.EmployeeID')
            .select([
                '*',
            ])
            .where('account.Id = :id', { id: newUser.Id })
            .getRawOne();

        if (!createdUser) {
            return null;
        }

        // Trả về dữ liệu với thông tin Employee được gộp vào
        return {
            ...createdUser,
            Employee: {
                EmployeeID: createdUser.employee_EmployeeID,
                FullName: createdUser.employee_FullName,
            },
        };
    },

    async findByUsername(username: string): Promise<MySQLAccount | null> {
        const user = await this.createQueryBuilder('account')
            .leftJoinAndSelect('account.Employee', 'employee') // Sử dụng mối quan hệ đã định nghĩa trong entity
            .where('account.Username = :username', { username })
            .getOne(); // Sử dụng getOne để ánh xạ dữ liệu vào entity

        if (!user) {
            return null;
        }

        return user;
    },
    async findByEmail(email: string): Promise<MySQLAccount | null> {
        return this.findOneBy({ Email: email })
    },
    async updateUserAsync(
        id: number,
        updateData: Partial<MySQLAccount>
    ): Promise<MySQLAccount | null> {
        await this.update(id, updateData);
        return this.findOneBy({ Id: id });
    },

    async getAll(): Promise<(MySQLAccount & { FullName: string })[] | null> {
        const accounts = await this.createQueryBuilder('ACCOUNT')
            .leftJoinAndSelect('Employees', 'employee', 'account.EmployeeID = employee.EmployeeID')
            .select(['*', 'employee.FullName'])
            .getRawMany();

        console.log("acc: ", accounts)

        return accounts;
    },

    async updateAsync(id: number, data: MySQLAccount): Promise<(MySQLAccount & { Employee: { EmployeeID: number; FullName: string } }) | null> {
        // Lấy bản ghi hiện tại
        const existingRecord = await mysqlRepository.findOneBy({ Id: id });
        if (!existingRecord) {
            return null;
        }

        // Gộp dữ liệu mới với dữ liệu hiện tại
        const updatedData = {
            ...existingRecord, // Giữ nguyên các trường hiện tại
            ...data, // Ghi đè các trường được truyền trong data
        };

        // Cập nhật bản ghi
        await mysqlRepository.update({ Id: id }, updatedData);

        // Lấy bản ghi đã cập nhật với thông tin Employee
        const updatedRecord = await this.createQueryBuilder('account')
            .leftJoinAndSelect('Employees', 'employee', 'account.EmployeeID = employee.EmployeeID')
            .select([
                '*'
            ])
            .where('account.Id = :id', { id })
            .getRawOne();

        if (!updatedRecord) {
            return null;
        }

        // Trả về dữ liệu với thông tin Employee được gộp vào
        return {
            ...updatedRecord,
            Employee: {
                EmployeeID: updatedRecord.EmployeeID,
                FullName: updatedRecord.FullName,
            },
        };
    },



});

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

    async createUserAsync(userData: Partial<MySQLAccount>): Promise<MySQLAccount> {
        const newUser = this.create(userData);
        return this.save(newUser);
    },

    async findByUsername(username: string): Promise<MySQLAccount | null> {
        return this.findOneBy({ Username: username })
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

    async updateAsync(id: number, data: MySQLAccount): Promise<(MySQLAccount) | null> {

        const existingRecord = await mysqlRepository.findOneBy({ Id: id });
        if (!existingRecord) {
            return null;
        }
        const updatedData = {
            ...existingRecord, // Giữ nguyên các trường hiện tại
            ...data, // Ghi đè các trường được truyền trong data
        };

        // Cập nhật bản ghi
        await mysqlRepository.update({ Id: id }, updatedData);

        // Lấy bản ghi đã cập nhật
        const updatedRecord = await mysqlRepository.findOneBy({ Id: id });
        return updatedRecord || null;

    },


});

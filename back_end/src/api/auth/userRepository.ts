import { MySQLAccount } from '../../model/mysql/account.entity';

import {MSSQLDataSource, MySQLDataSource} from '../../config/typeorm.config';

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

    async getAll(): Promise<MySQLAccount[] | null> {
        return this.find();
    }

});

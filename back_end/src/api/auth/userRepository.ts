import { Account } from '../../model/account.entity';
import dataSource from '../../config/typeorm.config';



export const userRepository = dataSource.getRepository(Account).extend({
    async findAllAsync(): Promise<Account[]> {
        return this.find();
    },

    async findByIdAsync(id: number): Promise<Account | null> {
        return this.findOneBy({ Id: id });
    },

    async createUserAsync(userData: Partial<Account>): Promise<Account> {
        const newUser = this.create(userData);
        return this.save(newUser);
    },

    async findByUsername(username: string): Promise<Account | null> {
        return this.findOneBy({ Username: username })
    },
    async findByEmail(email: string): Promise<Account | null> {
        return this.findOneBy({ Email: email })
    },
    async updateUserAsync(
        id: number,
        updateData: Partial<Account>
    ): Promise<Account | null> {
        await this.update(id, updateData);
        return this.findOneBy({ Id: id });
    },

    async getAll(): Promise<Account[] | null> {
        return this.find();
    }

});

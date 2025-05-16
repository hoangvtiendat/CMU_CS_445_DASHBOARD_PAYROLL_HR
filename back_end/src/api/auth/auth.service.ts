import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { userRepository } from './userRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { generateJwt, verifyJwt } from '../services/jwtService';
import { Login, Token, LoginResponse } from '../auth/auth.interface';
import { calculateUnixTime } from '../services/caculateDatetime';
// import mailService from '../../services/sendEmail';
import { verify } from 'crypto';
import { MySQLAccount } from '../../model/mysql/account.entity'




// import cacheService from '../../services/cache/cache.service';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const authService = {

    login: async (loginData: Login): Promise<ServiceResponse<MySQLAccount| null>> => {
        try {
            const user = await userRepository.findByUsername(loginData.username);
            console.log("userrr: ", user)
            if (!user) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'User not found',
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const isPasswordValid = await bcrypt.compare(loginData.password, user.Password);
            if (!isPasswordValid) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'Password incorrect',
                    null,
                    StatusCodes.UNAUTHORIZED
                );
            }
            const token: Token = {
                accessToken: generateJwt({ userId: user.Id }),
                refreshToken: generateJwt({ userId: user.Id }),
                expiresIn: calculateUnixTime(process.env.JWT_EXPIRES_IN || '1h'),
                tokenType: 'Bearer',
                role: user.Role as "Employee" | "Hr" | "Payroll" | "Admin",
            };
            await userRepository.updateAsync(user.Id, {
                ...user, // Include all existing properties of the user
                Access_token: token.accessToken,
                Reset_token: token.refreshToken, // Nếu bạn muốn lưu refreshToken vào Reset_token
            });
            const responseData = {
                ...user,
                // employeeID: user.Employee ? user.Employee.EmployeeID : 0,
                token: token.accessToken,
            };
            return new ServiceResponse<MySQLAccount>(
                ResponseStatus.Success,
                'Login successful',
                responseData,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error logging in: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
    register: async (userData: MySQLAccount): Promise<ServiceResponse<MySQLAccount | null>> => {
        try {
            const username = await userRepository.findByUsername(userData.Username);
            if (username) {
                throw new Error('username already exists');
            }
            const hashedPassword = await bcrypt.hash(userData.Password, 10);
            const newUser = await userRepository.createUserAsync({
                ...userData,
                Password: hashedPassword,
            })
            if (!newUser) {
                throw new Error("Error create user")
            }
            return new ServiceResponse<MySQLAccount>(
                ResponseStatus.Success,
                'User registered successfully!',
                newUser,
                StatusCodes.CREATED
            );
        } catch (error) {
            const errorMessage = `Error registering user: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getAll: async (): Promise<ServiceResponse<(MySQLAccount & { FullName: string })[]>> => {
        try {
            console.log(1);
            const allAccount = await userRepository.getAll();
            console.log(2);

            if (!allAccount) {
                throw new Error("empty");
            }
            // console.log("all acc: ", allAccount)

            return new ServiceResponse<(MySQLAccount & { FullName: string })[]>(
                ResponseStatus.Success,
                'Users retrieved successfully!',
                allAccount,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error get all account: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                [],
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (id: number, data: MySQLAccount): Promise<ServiceResponse<(MySQLAccount | null)>> => {
        try {

            const account = await userRepository.findByIdAsync(id);
            if (!account) {
                throw new Error("Account not found");
            }


            if (data.Password) {
                data.Password = await bcrypt.hash(data.Password, 10);
            }


            const accountUpdated = await userRepository.updateAsync(id, data);
            if (!accountUpdated) {
                throw new Error("Error Update");
            }

            return new ServiceResponse<(MySQLAccount)>(
                ResponseStatus.Success,
                'Account updated successfully!',
                accountUpdated,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error updating account: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (id: number): Promise<ServiceResponse<string>> => {
        try {
            const checkAccount = await userRepository.findByIdAsync(id);
            if (!checkAccount) {
                throw new Error("This account does not exist")
            }
            const userDelete = await userRepository.delete({ Id: id });
            let res: string;
            if (userDelete) {
                res = "DELETE SUCCESSFULL";
            } else {
                res = "DELETE FAIL";
            }
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                'deleting salary record successful',
                res,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error delete account: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                "DELETE FAIL",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    logout: async (token: string): Promise<ServiceResponse<string | null>> => {
        try {
            let decoded;
            try {
                decoded = verifyJwt(token);
            } catch (err: any) {
                if (err.name === 'TokenExpiredError') {
                    // Nếu token hết hạn, vẫn cố gắng lấy userId từ token (nếu có thể)
                    decoded = (verifyJwt(token) as any);
                } else {
                    throw err;
                }
            }
            if (!decoded) { 
                throw new Error('Invalid token');
            }
            const userId = decoded.userId;
            const user = await userRepository.findByIdAsync(userId);
            if (!user) {
                throw new Error('User not found');
            }
            await userRepository.updateAsync(userId, { ...user, Reset_token: null, Access_token: null });
            return new ServiceResponse(
                ResponseStatus.Success,
                'Logout successful',
                null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error logging out: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}



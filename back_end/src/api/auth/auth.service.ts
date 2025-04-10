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

    login: async (loginData: Login): Promise<ServiceResponse<LoginResponse | null>> => {
        try {
            console.log(loginData.username)
            const user = await userRepository.findByUsername(loginData.username);
            console.log(2)

            if (!user) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'User not found',
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            if (user.Password !== loginData.password) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'Password incorrect',
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const token: Token = {
                accessToken: generateJwt({ userId: user.Id }),
                refreshToken: generateJwt({ userId: user.Id }),
                expiresIn: calculateUnixTime(process.env.JWT_EXPIRES_IN || '1h'),
                tokenType: 'Bearer',
                role: user.Role as "Employee" | "Hr" | "Payroll" | "Admin",
            };
            const responseData = {
                user: {
                    id: user.Id,
                    username: user.Username,
                    fullName: user.FullName,
                    email: user.Email,
                    role: user.Role as "Employee" | "Hr" | "Payroll" | "Admin",
                },
                token: token.accessToken,

            };
            return new ServiceResponse<LoginResponse>(
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
        } catch (ex) {
            const errorMessage = `Error registering user: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}



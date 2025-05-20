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
import mailService from '../services/sendMail.service';


export const authService = {

    login: async (loginData: Login): Promise<ServiceResponse<MySQLAccount | null>> => {
        try {
            const user = await userRepository.findByUsername(loginData.username);
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
            const allAccount = await userRepository.getAll();
            if (!allAccount) {
                throw new Error("empty");
            }
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

    logout: async (id: number): Promise<ServiceResponse<string | null>> => {
        try {
            const accountID = await userRepository.findByEmployeeIdAsync(id);
            if (!accountID) {
                throw new Error("No user found for this account");
            }
            const account = await userRepository.findByIdAsync(Number(accountID.account_Id));
            if (!account) {
                throw new Error("Account not found");
            }
            const accountUpdated = await userRepository.updateAsync(accountID.account_Id, {
                ...account,
                Access_token: null,
                Reset_token: null,
            });
            if (!accountUpdated) {
                throw new Error("Error Update");
            }
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                'Logout successful',
                "Logout successful",
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error logging out: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.UNAUTHORIZED
            );
        }
    },
    // verifyEmail: async (email: string): Promise<boolean> => {
    //     try {
    //         const user = await userRepository.findByEmailAsync(email);
    //         if (!user) {
    //             return false;
    //         }

    //         const verifyEmailToken = generateJwt({ email });
    //         console.log("verifyEmailToken generated");
    //         //       console.log("EMAIL_USER:", process.env.EMAIL_USER);
    //         // console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    //         const verifyUrl = `http://localhost:3000/auth/activate?token=${verifyEmailToken}`;
    //         console.log("verifyUrl generated, start send email");
    //         const mailIsSent = await mailService.sendEmail({
    //             emailFrom: process.env.EMAIL_USER as string,
    //             emailTo: email,
    //             emailSubject: "Verify email",
    //             emailText: `Click on the button below to verify your email: <a href="${verifyUrl}">Verify</a>`,
    //         });

    //         console.log("mailIsSent", mailIsSent);

    //         if (!mailIsSent) {
    //             return false;
    //         }

    //         // return new ServiceResponse<string>(
    //         //   ResponseStatus.Success,
    //         //   "Email activated successfully",
    //         //   email,
    //         //   StatusCodes.OK
    //         // );
    //         return true;
    //     } catch (ex) {
    //         const error = ex as Error;
    //         console.error("Email send error:", error.message);
    //         return false;
    //     }
    // },

}



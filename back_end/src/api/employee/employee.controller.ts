import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmployeeService } from './employee.service';
import { ResponseStatus } from '../services/serviceResponse';
// import { Login } from './auth.interface';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import passport from 'passport'
import { Account } from '../../model/account.entity'
interface UserProfile {
    id: string;
    tokenLogin: string;
    // Các thuộc tính khác của profile nếu có
}

export const EmployeeController = {

    async getAll(req: Request, res: Response) {
        try {

            const serviceResponse = await EmployeeService.getAll();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error logging in',
                error: (error as Error).message,
            });
        }
    }



};

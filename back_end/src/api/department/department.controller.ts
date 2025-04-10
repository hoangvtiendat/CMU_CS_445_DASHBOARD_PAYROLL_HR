
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DepartmentService } from './department.service';
import { ResponseStatus } from '../services/serviceResponse';
// import { Login } from './auth.interface';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import passport from 'passport'

interface UserProfile {
    id: string;
    tokenLogin: string;
    // Các thuộc tính khác của profile nếu có
}

export const DepartmentController = {

    async getAll(req: Request, res: Response) {
        try {

            const serviceResponse = await DepartmentService.getAll();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error Get All Department: ',
                error: (error as Error).message,
            });
        }
    },
    async getCount(req: Request, res: Response){
        try {
            const serviceResponsive = await DepartmentService.getCount();
            handleServiceResponse(serviceResponsive, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error Get Count Department: ',
                error: (error as Error).message,
            });
        }
    }



};

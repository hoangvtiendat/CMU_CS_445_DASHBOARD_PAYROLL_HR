
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AttendanceService } from './attendance.service';
import { ResponseStatus } from '../services/serviceResponse';
import { handleServiceResponse } from '../services/httpHandlerResponse';


export const AttendanceController = {
    async checkin(req: Request, res: Response) {
        try {
            const employeeId  = Number(req.params.id);
            const serviceResponse = await AttendanceService.checkin(employeeId);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error checkin',
                error: (error as Error).message,
            });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const serviceResponse = await AttendanceService.getAll();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get all attendance',
                error: (error as Error).message,
            });
        }
    },  
};

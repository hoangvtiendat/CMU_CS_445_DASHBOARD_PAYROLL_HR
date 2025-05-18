
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { alertService } from './alert.service';
import { ResponseStatus } from '../services/serviceResponse';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const AlertController = {
    async getAll(req: Request, res: Response) {
        try {
            const serviceResponse = await alertService.getAll();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get all alert',
                error: (error as Error).message,
            });
        }
    },
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PayrollService } from './payroll.service';
import { ResponseStatus, ServiceResponse } from '../services/serviceResponse';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import { log } from 'console';


export const PayrollController = {


    async status(req: Request, res: Response) {
        try {
            const serviceResponse = await PayrollService.status();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get status ',
                error: (error as Error).message,
            });
        }
    },

    async getSalaryByMonth(req: Request, res: Response) {
        try {
            const date = req.query.month;
            if (!date) {
               throw new Error("Please select a date")
            }
            const month = date.toString().split(' ')[0]; 
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
            if (monthIndex === -1) {
                throw new Error("Invalid month name");
            }
            const monthNumber = monthIndex + 1; // Convert to 1-based index
            const year = Number(date.toString().split(' ')[1]);

            const serviceResponse = await PayrollService.getSalaryByMonth(monthNumber, year);
            handleServiceResponse(serviceResponse, res);

            
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get status ',
                error: (error as Error).message,
            });
        }
    }

};

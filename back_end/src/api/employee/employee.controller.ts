import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmployeeService } from './employee.service';
import { ResponseStatus, ServiceResponse } from '../services/serviceResponse';
// import { Login } from './auth.interface';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import passport from 'passport'
import { error } from 'console';

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
                message: 'Error get all employee',
                error: (error as Error).message,
            });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const serviceResponse = await EmployeeService.getById(id);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get employee by id',
                error: (error as Error).message,
            });
        }
    },

    async information(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            console.log("id: ", id);
            const serviceResponse = await EmployeeService.information(id);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get employee by id',
                error: (error as Error).message,
            });
        }
    },

    async status(req: Request, res: Response) {
        console.log("status");
        try {
            const serviceResponse = await EmployeeService.status();
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error get status employee',
                error: (error as Error).message,
            });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            const serviceResponse = await EmployeeService.update(id, data);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error update employee',
                error: (error as Error).message,
            });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const serviceResponse = await EmployeeService.create(data);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error create employee',
                error: (error as Error).message,
            });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            const serviceResponse = await EmployeeService.delete(id);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'Failed',
                message: 'Error delete employee',
                error: (error as Error).message,
            });
        }
    },




};

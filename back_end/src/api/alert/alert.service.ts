import { AlertRepository } from './alertRepository';
import { employeeRepository } from '../employee/employeeRepository';
import { IAlert } from './alert.interface';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';

import { handleServiceResponse } from '../services/httpHandlerResponse';
import { get } from 'http';

export const alertService = {
    getAll: async (): Promise<ServiceResponse<IAlert[] | null>> => {
        try {
            const alerts = await AlertRepository.getAll();
            if (!alerts) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'No alerts found',
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            return new ServiceResponse<IAlert[] | null>(
                ResponseStatus.Success,
                'Alerts retrieved successfully',
                alerts,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error retrieving alerts: ${(error as Error).message}`;
            return new ServiceResponse<IAlert[] | null>(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    sendMail: async (id: number, data: string): Promise<ServiceResponse<string | null>> => {
        try {
            const email = await employeeRepository.findEmailById(id);
            if(!email) {
                throw new Error('Email is required');
            }
            const mailIsSent = await AlertRepository.sendMail(email, data);
            if (!mailIsSent) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    'Failed to send email',
                    "Send main successfully",
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            return new ServiceResponse<string | null>(
                ResponseStatus.Success,
                'Email sent successfully',
                null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error sending email: ${(error as Error).message}`;
            return new ServiceResponse<string | null>(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}



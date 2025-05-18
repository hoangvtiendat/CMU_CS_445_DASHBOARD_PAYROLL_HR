import { AlertRepository } from './alertRepository';
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
            console.log(1);
            const alerts = await AlertRepository.getAll();
            console.log(2);
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
    }
}



import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { departmentRepository } from './departmentRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { MySQLDepartment } from '../../model/mysql/department.entity';
import { MSSQLDepartment } from '../../model/mssql/department.entity';




// import cacheService from '../../services/cache/cache.service';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const DepartmentService = {

    getAll: async (): Promise<ServiceResponse<MySQLDepartment[] | MSSQLDepartment[] | null>> => {
        try {
            const departments = await departmentRepository.getAll();
            return new ServiceResponse<MySQLDepartment[] | MSSQLDepartment[]>(
                ResponseStatus.Success,
                'Department found',
                departments ?? [],
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = `Error get Employee user: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

    },
    getCount: async (): Promise<ServiceResponse<number | 0>> => {
        try {
            const count = await departmentRepository.getCount();
            if (!count) {
                return new ServiceResponse<number>(
                    ResponseStatus.Success,
                    'Count is 0',
                    0,
                    StatusCodes.OK
                );
            }
            return new ServiceResponse<number>(
                ResponseStatus.Success,
                'Count retrieved successfully',
                count ?? 0,
                StatusCodes.OK
            );
        } catch (ex) {
            
            const errorMessage = `Error get Employee user: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                0,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

    }


}



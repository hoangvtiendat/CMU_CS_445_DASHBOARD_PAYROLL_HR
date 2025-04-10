import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { employeeRepository } from './employeeRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { generateJwt, verifyJwt } from '../services/jwtService';
import { Login, Token } from '../auth/auth.interface';
import { calculateUnixTime } from '../services/caculateDatetime';
// import mailService from '../../services/sendEmail';
import { verify } from 'crypto';
import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';




// import cacheService from '../../services/cache/cache.service';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const EmployeeService = {

    getAll: async (): Promise<ServiceResponse<MySQLEmployee[] | MSSQLEmployee[] | null>> => {
        try {
            const users = await employeeRepository.getAll();
            return new ServiceResponse<MySQLEmployee[] | MSSQLEmployee[] >(
                ResponseStatus.Success,
                'User found',
                users ?? [],
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

    }


}



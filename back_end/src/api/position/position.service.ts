import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { positionRepository } from './positionRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { MySQLPosition } from '../../model/mysql/position.entity';
import { MSSQLPosition } from '../../model/mssql/position.entity';


// import cacheService from '../../services/cache/cache.service';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const PositionService = {

    getAll: async (): Promise<ServiceResponse<MySQLPosition[] | MSSQLPosition[] | null>> => {
        try {
            const positions = await positionRepository.getAll();
            return new ServiceResponse<MySQLPosition[] | MSSQLPosition[]>(
                ResponseStatus.Success,
                'Department found',
                positions ?? [],
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
            const count = await positionRepository.getCount();
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



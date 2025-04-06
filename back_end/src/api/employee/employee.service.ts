import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { userRepository } from '../auth/userRepository';
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
import { Account } from '../../model/account.entity'




// import cacheService from '../../services/cache/cache.service';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const EmployeeService = {

    getAll: async (): Promise<ServiceResponse<Account[] | null>> => {
        try {
            const users = await userRepository.getAll();
            return new ServiceResponse<Account[]>(
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



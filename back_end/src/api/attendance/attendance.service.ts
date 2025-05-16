import bcrypt from 'bcryptjs';

// import { Users } from '../../model/users.entity';
import { AttendanceRepository } from './attendanceRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';
import { handleServiceResponse } from '../services/httpHandlerResponse';

export const AttendanceService = {
    checkin: async (employeeId: number): Promise<ServiceResponse<MySQLAttendance | null>> => {
        try {
            const attendance = await AttendanceRepository.checkin(employeeId);
            if (!attendance) {
                throw new Error("This user does not exist")
            }
            return new ServiceResponse<MySQLAttendance | null>(
                ResponseStatus.Success,
                'Checkin success',
                attendance,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error checkin: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}





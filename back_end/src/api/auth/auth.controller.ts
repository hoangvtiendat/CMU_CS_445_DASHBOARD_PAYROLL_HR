import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from './auth.service';
import { ResponseStatus } from '../services/serviceResponse';
import { Login } from './auth.interface';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import passport from 'passport'
import {MySQLAccount} from '../../model/mysql/account.entity'
interface UserProfile {
  id: string;
  tokenLogin: string;
  // Các thuộc tính khác của profile nếu có
}

export const AuthController = {


  async login(req: Request, res: Response) {
    const loginData: Login = req.body;
    try {
      console.log("Login Request:", loginData);
      const serviceResponse = await authService.login(loginData);
      console.log("Service Response:", serviceResponse);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error logging in',
        error: (error as Error).message,
      });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const userData: MySQLAccount = req.body;
      const serviceResponse = await authService.register(userData);
      handleServiceResponse(serviceResponse, res);
    }
    catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error register in',
        error: (error as Error).message,
      });
    }
  },
  
  // async getMe(req: Request, res: Response){
  //   try{
  //     const user = req.user as UserProfile;
  //     if (!user) {
  //       return res.status(StatusCodes.UNAUTHORIZED).json({
  //         status: 'Failed',
  //         message: 'User not authenticated',
  //       });
  //     }

  //     res.status(StatusCodes.OK).json({
  //       status: 'Success',
  //       data: {
  //         id: user.id,
  //         tokenLogin: user.tokenLogin,
  //       },
  //     });
  //   }
  //   catch(error)
  //   {
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //       status: 'Failed',
  //       message: 'Error register in',
  //       error: (error as Error).message,
  //     });
  //   }
  // }
};

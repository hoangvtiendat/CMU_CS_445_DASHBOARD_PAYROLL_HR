import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from './auth.service';
import { ResponseStatus } from '../services/serviceResponse';
import { Login } from './auth.interface';
import { handleServiceResponse } from '../services/httpHandlerResponse';
import passport from 'passport'
import { MySQLAccount } from '../../model/mysql/account.entity'
import { P } from 'pino';
interface UserProfile {
  id: string;
  tokenLogin: string;
  // Các thuộc tính khác của profile nếu có
}

export const AuthController = {


  async login(req: Request, res: Response) {
    const loginData: Login = req.body;
    try {
      const serviceResponse = await authService.login(loginData);
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
  
  async getAll(req: Request, res: Response) {
    try {
      const serviceResponse = await authService.getAll();
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error get all account',
        error: (error as Error).message,
      });
    }
  },
  async udpate(req: Request, res: Response) {
    try {
      const id = Number(req.params.Id);
      const data = req.body;

      const serviceResponse = await authService.update(id, data);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error update account',
        error: (error as Error).message,
      });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.Id);
      const serviceResponse = await authService.delete(id);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error delete account',
        error: (error as Error).message,
      });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const serviceResponse = await authService.logout(id);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'Failed',
        message: 'Error logging out',
        error: (error as Error).message,
      });
    }
  }

};

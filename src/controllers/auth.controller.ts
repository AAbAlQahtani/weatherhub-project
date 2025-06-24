import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { AppError } from '../utils/error';
import { AuthRequest } from '../middleware/auth.middleware';
import { dev } from '../utils/helpers';
import { CREATED, OK } from '../utils/http-status';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken} = await AuthService.signUp({
      email,
      password,
    });

    // Set cookies with SameSite=None and secure flag
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: !dev,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    
    res.status(CREATED).json({
      status: 'success',
      data: {
        // Remove password from output
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password} = req.body;

    const { user, accessToken } = await AuthService.signIn(
      email,
      password
    );

    // Set cookies with SameSite=None and secure flag
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: !dev,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });


    res.status(OK).json({
      status: 'success',
      data: {
        // Remove password from output
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response) => {
  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: !dev,
    sameSite: 'none',
  });


  res.status(OK).json({
    status: 'success',
    message: 'Signed out successfully',
  });
};


const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await AuthService.deleteAccount(req.user.id);

    res.cookie('accessToken', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: !dev,
      sameSite: 'none',
    });

    res.status(OK).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  signUp,
  signIn,
  signOut,
  deleteAccount,
};

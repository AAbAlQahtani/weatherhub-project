import jwt from 'jsonwebtoken';
import { UsersCollection, UserDocument } from '../models/user.model';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../utils/error';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from '../utils/http-status';

const signUp = async (userData: {
  email: string;
  password: string;
}): Promise<{ user: UserDocument; accessToken: string; }> => {
  const existingUser = await UsersCollection.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already exists', BAD_REQUEST);
  }

  const user = await UsersCollection.create(userData);
  const { accessToken } = await generateTokens(user);

  return { user, accessToken };
}

const signIn = async (email: string, password: string): Promise<{
  user: UserDocument;
  accessToken: string;
}> => {
  const user = await UsersCollection.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', UNAUTHORIZED);
  }

  const { accessToken } = await generateTokens(user);
  return { user, accessToken };
}
 

const deleteAccount = async (userId: string): Promise<void> => {
  const user = await UsersCollection.findOne({ id: userId });
  if (!user) {
    throw new AppError('User not found', NOT_FOUND);
  }

  await UsersCollection.deleteOne({ id: userId });
};

const generateTokens = async (
  user: UserDocument
): Promise<{ accessToken: string; }> => {
  const accessToken = jwt.sign(
    {
      type: 'access',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  );
  return { accessToken};
};

export {
  signUp,
  signIn,
  deleteAccount,
  generateTokens,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.deleteAccount = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const signUp = async (userData) => {
    const existingUser = await user_model_1.UsersCollection.findOne({ email: userData.email });
    if (existingUser) {
        throw new error_1.AppError('Email already exists', http_status_1.BAD_REQUEST);
    }
    const user = await user_model_1.UsersCollection.create(userData);
    const { accessToken } = await generateTokens(user);
    return { user, accessToken };
};
exports.signUp = signUp;
const signIn = async (email, password) => {
    const user = await user_model_1.UsersCollection.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new error_1.AppError('Invalid credentials', http_status_1.UNAUTHORIZED);
    }
    const { accessToken } = await generateTokens(user);
    return { user, accessToken };
};
exports.signIn = signIn;
const deleteAccount = async (userId) => {
    const user = await user_model_1.UsersCollection.findOne({ id: userId });
    if (!user) {
        throw new error_1.AppError('User not found', http_status_1.NOT_FOUND);
    }
    await user_model_1.UsersCollection.deleteOne({ id: userId });
};
exports.deleteAccount = deleteAccount;
const generateTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        type: 'access',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
    return { accessToken };
};
exports.generateTokens = generateTokens;

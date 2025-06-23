"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.signOut = exports.signIn = exports.signUp = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const helpers_1 = require("../utils/helpers");
const http_status_1 = require("../utils/http-status");
const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken } = await AuthService.signUp({
            email,
            password,
        });
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.status(http_status_1.CREATED).json({
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
    }
    catch (error) {
        next(error);
    }
};
exports.signUp = signUp;
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken } = await AuthService.signIn(email, password);
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.status(http_status_1.OK).json({
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
    }
    catch (error) {
        next(error);
    }
};
exports.signIn = signIn;
const signOut = async (req, res) => {
    res.cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.status(http_status_1.OK).json({
        status: 'success',
        message: 'Signed out successfully',
    });
};
exports.signOut = signOut;
const deleteAccount = async (req, res, next) => {
    try {
        await AuthService.deleteAccount(req.user.id);
        res.cookie('accessToken', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.status(http_status_1.OK).json({
            status: 'success',
            message: 'Account deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'ab1bc57b25f2d2da567b8c09ef1656428912f75d715c8c26ccd85d51cfbe49f6',
    accessToken: {
        options: {
            expiresIn: '15m',
            algorithm: 'HS256',
        },
    },
    refreshToken: {
        options: {
            expiresIn: '7d',
            algorithm: 'HS256',
        },
    },
};

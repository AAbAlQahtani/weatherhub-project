"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = require("../utils/http-status");
const router = (0, express_1.Router)();
router.get('/db', (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    }[dbState] || 'unknown';
    const isHealthy = dbState === 1;
    res.status(isHealthy ? http_status_1.OK : http_status_1.SERVICE_UNAVAILABLE).json({
        status: isHealthy ? 'success' : 'error',
        message: isHealthy ? 'Database is healthy' : 'Database is not healthy',
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatus,
            readyState: dbState
        }
    });
});
exports.default = router;

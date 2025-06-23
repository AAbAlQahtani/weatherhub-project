"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryCollection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const historySchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', index: true },
    weather: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Weather' },
    lat: Number,
    lon: Number,
    requestedAt: { type: Date, default: Date.now, index: true },
});
historySchema.index({ user: 1, requestedAt: -1 });
exports.HistoryCollection = mongoose_1.default.model('History', historySchema);

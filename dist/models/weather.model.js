"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherCollection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const weatherSchema = new mongoose_1.default.Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    data: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, default: Date.now, expires: process.env.WEATHER_CACHE_MINUTES || 1800 }
});
weatherSchema.index({ lat: 1, lon: 1 }, { unique: true });
exports.WeatherCollection = mongoose_1.default.model('Weather', weatherSchema);

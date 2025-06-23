"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const weather_model_1 = require("../models/weather.model");
const history_model_1 = require("../models/history.model");
const error_1 = require("../utils/error");
const WEATHER_CACHE_MINUTES = parseInt(process.env.WEATHER_CACHE_MINUTES || '30');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const roundCoord = (num) => {
    return Math.round(num * 100) / 100;
};
const getWeather = async (user, lat, lon) => {
    if (!OPENWEATHER_API_KEY) {
        throw new error_1.AppError('Missing OpenWeather API key', 500);
    }
    const roundedLat = roundCoord(lat);
    const roundedLon = roundCoord(lon);
    const cacheTTL = new Date(Date.now() - WEATHER_CACHE_MINUTES * 60 * 1000);
    let weather = await weather_model_1.WeatherCollection.findOne({
        lat: roundedLat,
        lon: roundedLon,
        fetchedAt: { $gte: cacheTTL },
    });
    let source = 'cache';
    if (!weather) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await axios_1.default.get(url);
        weather = await weather_model_1.WeatherCollection.create({
            lat: roundedLat,
            lon: roundedLon,
            data: response.data,
            fetchedAt: new Date(),
        });
        source = 'openweather';
    }
    await history_model_1.HistoryCollection.create({
        user: user._id,
        weather: weather._id,
        lat: roundedLat,
        lon: roundedLon,
        requestedAt: new Date(),
    });
    return {
        source,
        coordinates: { lat: roundedLat, lon: roundedLon },
        tempC: weather.data.main.temp,
        humidity: weather.data.main.humidity,
        description: weather.data.weather[0].description,
        fetchedAt: weather.fetchedAt,
    };
};
exports.getWeather = getWeather;

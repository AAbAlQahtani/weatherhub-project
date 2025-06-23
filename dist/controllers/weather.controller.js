"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const weather_model_1 = require("../models/weather.model");
const history_model_1 = require("../models/history.model");
const API_KEY = process.env.WEATHER_API_KEY || '75b744858bd63aea69135ca681c485c0';
const fetchWeather = async (lat, lon) => {
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const response = await axios_1.default.get(url, {
        params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};
const getWeather = async (req, res) => {
    try {
        if (!API_KEY) {
            res.status(500).json({ success: false, error: 'API key is missing' });
            return;
        }
        const user = req.user;
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            res.status(400).json({ success: false, error: 'enter lat and lon' });
            return;
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const roundedLat = +latitude.toFixed(2);
        const roundedLon = +longitude.toFixed(2);
        let weather = await weather_model_1.WeatherCollection.findOne({ lat: roundedLat, lon: roundedLon });
        if (!weather) {
            const data = await fetchWeather(latitude, longitude);
            weather = await weather_model_1.WeatherCollection.create({
                lat: roundedLat,
                lon: roundedLon,
                data,
                fetchedAt: new Date(),
            });
        }
        await history_model_1.HistoryCollection.create({
            user: user.id,
            weather: weather._id,
            lat: latitude,
            lon: longitude,
        });
        res.json({ success: true, data: weather.data });
    }
    catch (err) {
        console.error('Weather Error:', err);
        res.status(500).json({ success: false, error: 'error' });
    }
};
exports.getWeather = getWeather;

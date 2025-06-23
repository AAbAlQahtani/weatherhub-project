"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const history_model_1 = require("../models/history.model");
const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const entries = await history_model_1.HistoryCollection.find({ user: userId }).populate('weather');
        const formatted = entries.map((entry) => ({
            lat: entry.lat,
            lon: entry.lon,
            requestedAt: entry.requestedAt,
            weather: {
                tempC: entry.weather?.data?.main?.temp,
                description: entry.weather?.data?.weather?.[0]?.description,
            },
        }));
        res.json({ success: true, data: formatted });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Something went wrong.' });
    }
};
exports.getHistory = getHistory;

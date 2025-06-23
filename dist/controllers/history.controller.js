"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const history_model_1 = require("../models/history.model");
const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await history_model_1.HistoryCollection.find({ user: userId }).populate('weather');
        res.json({ success: true, data: history });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Something went wrong.' });
    }
};
exports.getHistory = getHistory;

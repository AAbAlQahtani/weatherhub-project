import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  fetchedAt: { type: Date, default: Date.now, expires: process.env.WEATHER_CACHE_MINUTES || 1800 }
});

weatherSchema.index({ lat: 1, lon: 1 }, { unique: true });

export const WeatherCollection = mongoose.model('Weather', weatherSchema);

import { Request, Response } from 'express';
import axios from 'axios';
import { WeatherCollection } from '../models/weather.model';
import { HistoryCollection } from '../models/history.model';

const API_KEY = process.env.WEATHER_API_KEY || '75b744858bd63aea69135ca681c485c0';

const fetchWeather = async (lat: number, lon: number) => {
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const response = await axios.get(url, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!API_KEY) {
      res.status(500).json({ success: false, error: 'API key is missing' });
      return;
    }

    const user = (req as any).user;
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ success: false, error: 'enter lat and lon' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    const roundedLat = +latitude.toFixed(2);
    const roundedLon = +longitude.toFixed(2);

    let weather = await WeatherCollection.findOne({ lat: roundedLat, lon: roundedLon });

    if (!weather) {
      const data = await fetchWeather(latitude, longitude);
      weather = await WeatherCollection.create({
        lat: roundedLat,
        lon: roundedLon,
        data,
        fetchedAt: new Date(),
      });
    }

    await HistoryCollection.create({
      user: user.id, 
      weather: weather._id,
      lat: latitude,
      lon: longitude,
    });

    res.json({ success: true, data: weather.data });
  } catch (err: any) {
    console.error('Weather Error:', err);
    res.status(500).json({ success: false, error: 'error' });
  }
};

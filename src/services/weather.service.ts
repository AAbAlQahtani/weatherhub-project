import axios from 'axios';
import { WeatherCollection } from '../models/weather.model';
import { HistoryCollection } from '../models/history.model';
import { AppError } from '../utils/error';
import { UserDocument } from '../models/user.model';

const WEATHER_CACHE_MINUTES = parseInt(process.env.WEATHER_CACHE_MINUTES || '30');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const roundCoord = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const getWeather = async (user: UserDocument, lat: number, lon: number) => {
  if (!OPENWEATHER_API_KEY) {
    throw new AppError('Missing OpenWeather API key', 500);
  }

  const roundedLat = roundCoord(lat);
  const roundedLon = roundCoord(lon);
  const cacheTTL = new Date(Date.now() - WEATHER_CACHE_MINUTES * 60 * 1000);

  let weather = await WeatherCollection.findOne({
    lat: roundedLat,
    lon: roundedLon,
    fetchedAt: { $gte: cacheTTL },
  });

  let source = 'cache';

  if (!weather) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);
    weather = await WeatherCollection.create({
      lat: roundedLat,
      lon: roundedLon,
      data: response.data,
      fetchedAt: new Date(),
    });

    source = 'openweather';
  }

  await HistoryCollection.create({
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

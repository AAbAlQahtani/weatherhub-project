import { Request, Response } from 'express';
import { HistoryCollection } from '../models/history.model';

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const entries = await HistoryCollection.find({ user: userId }).populate('weather');
    const formatted = entries.map((entry: any) => ({
      lat: entry.lat,
      lon: entry.lon,
      requestedAt: entry.requestedAt,
      weather: {
        tempC: entry.weather?.data?.main?.temp,
        description: entry.weather?.data?.weather?.[0]?.description,
      },
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong.' });
  }
};

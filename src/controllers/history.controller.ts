import { Request, Response } from 'express';
import { HistoryCollection } from '../models/history.model';

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const history = await HistoryCollection.find({ user: userId }).populate('weather');

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong.' });
  }
};

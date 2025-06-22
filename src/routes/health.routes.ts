import { Router } from 'express';
import mongoose from 'mongoose';
import { OK, SERVICE_UNAVAILABLE } from '../utils/http-status';

const router = Router();

router.get('/db', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  }[dbState] || 'unknown';

  const isHealthy = dbState === 1;

  res.status(isHealthy ? OK : SERVICE_UNAVAILABLE).json({
    status: isHealthy ? 'success' : 'error',
    message: isHealthy ? 'Database is healthy' : 'Database is not healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      readyState: dbState
    }
  });
});

export default router; 
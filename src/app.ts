import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';
import { connectDB, deleteAllCollections } from './config/database';
import { AppError } from './utils/error';
import historyRoutes from './routes/history.routes';
import weatherRoutes from './routes/weather.route';


// Load environment variables
dotenv.config();

// // Delete all collections
// deleteAllCollections();

// Connect to MongoDB
connectDB();

const app: Express = express();

// Middleware




const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'https://weatherhub-frontend.onrender.com' 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(helmet());
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/weather', weatherRoutes);



// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(OK)
    .json({ message: 'List & Items API - Welcome!' });
});

// Error handling middleware
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(dev && { stack: err.stack })
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    status: 'error', 
    message: 'Something went wrong!',
    ...(dev && { error: err.message, stack: err.stack })
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

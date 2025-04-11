import express, { response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';
import { getRandomUser } from './users.js';

dotenv.config();

const app = express();
const serverName = process.env.SERVER_NAME || 'defaultservice';
const port = parseInt(process.env.SERVER_PORT || '3000', 10);

// Setup Winston logger
const logDir = '/var/log';
const logPath = path.join(logDir, `${serverName}.log`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: logPath }),
    new winston.transports.Console(), // Optional: Log to console as well
  ],
});

// Middleware to log request and response
app.use((req, res, next) => {
  const now = new Date().toISOString();
  const originalSend = res.send;

  // Override res.send to capture the response body
  res.send = function (body) {
    const logEntry = {
      timestamp: now,
      method: req.method,
      url: req.originalUrl,
      serverName,
      serverPort: port,
      responseBody: body, // Log the response body
    };
    logger.info(logEntry);
    return originalSend.call(this, body);
  };

  next();
});

// JSON middleware
app.use(express.json());

// Routes
app.get('/liveliness', (req, res) => {
  res.json({ status: 'OK', serverName, serverPort: port });
});

app.get('/user', (req, res) => {
  const user = getRandomUser();
  res.json(user);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  logger.info({ message: `${serverName} running on http://0.0.0.0:${port}` });
});

import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { getRandomUser } from './users.js';

dotenv.config();

const app = express();
const serverName = process.env.SERVER_NAME || 'defaultservice';
const port = parseInt(process.env.SERVER_PORT || '3000', 10);

// Setup logging to /var/log/<SERVER_NAME>.log
const logDir = '/var/log';
const logPath = path.join(logDir, `${serverName}.log`);
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

app.use((req, res, next) => {
  const now = new Date().toISOString();
  const logLine = `${now} ${req.method} ${req.originalUrl}\n`;
  logStream.write(logLine);
  next();
});

// JSON middleware
app.use(express.json());

// Routes
app.get('/liveliness', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/user', (req, res) => {
  const user = getRandomUser();
  res.json(user);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`${serverName} running on http://0.0.0.0:${port}`);
});

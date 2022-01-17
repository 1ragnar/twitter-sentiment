/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env' });
}

import util from 'util';
import mongoose from 'mongoose';
import DailySentiment from '../src/models/DailySentiment';
import app from './app';
import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';
import * as consumer from './consumer';
import Price from '../src/models/Price';

const cors = require('cors');

app.use(cors());

app.post('/prices', async (req, res) => {
  try {
    const prices = await Price.find({
      time: {
        $lte: new Date(req.body.endDate), $gte: new Date(req.body.startDate)
      }
    });
    res.json(prices);
  } catch (error) {
    logger.log({
      level: 'error',
      message: error,
      error
    });
  }
});

app.post('/sentiments', async (req, res) => {
  try {
    const sentiments = await DailySentiment.find({
      _id: {
        $lte: req.body.endDate, $gte: req.body.startDate
      }
    });
    res.json(sentiments);
  } catch (error) {
    logger.log({
      level: 'error',
      message: error,
      error
    });
  }
});

const fetch = require('node-fetch');

globalThis.fetch = fetch;

const PORT = process.env.PORT || 3001;

let debugCallback = null;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.MONGO_URL,
  debugCallback,
  onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) => logger.log({
    level: 'error',
    message: `Could not connect to MongoDB at ${mongoUrl}`,
    error
  }),
  onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});

const consume = async () => {
  logger.info('🐦 Starting twitter consumer');

  await consumer.scan();
};

const sentimentGrouping = async () => {
  logger.info('🐦 Starting sentiment grouping');

  await consumer.groupingByDay();
};

const importBTCPrice = async () => {
  logger.info('🐦 Importing BTC price');

  await consumer.createPriceDbCollection();
};
const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);

  if (process.env.NODE_ENV === 'development') {
    // This route is only present in development mode
    logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`);
  }
});

if (process.env.MONGO_URL == null) {
  logger.error('MONGO_URL not specified in environment');
  process.exit(1);
} else {
  safeMongooseConnection.connect(mongoUrl => {
    logger.info(`Connected to MongoDB at ${mongoUrl}`);
    serve();
    // importBTCPrice();
    // consume();
    // sentimentGrouping();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  safeMongooseConnection.close(err => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err
      });
    } else {
      logger.info('Mongo connection closed successfully');
    }
    process.exit(0);
  }, true);
});

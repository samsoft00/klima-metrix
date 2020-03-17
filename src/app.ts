import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import log from 'fancy-log';
import lusca from 'lusca';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';

import routes from './routes';
import Database from './lib/database';

dotenv.config();

const { env } = config.get('general');
const isProduction = env === 'production';

const app = express();
const corsOptions = {
  credentials: true,
  origin: [],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// compression and header security middleware
app.use(compression());
app.use(helmet());

app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);
app.use(bodyParser.json());

// Serve the two static assets
app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  // err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res, next) => {
    log(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        error: err
      },
      status: false
    });
  });
}

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {}
    },
    status: false
  });
});

console.log(Database.fetchCompanies());

export default app;

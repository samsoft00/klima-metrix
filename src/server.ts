import log from 'fancy-log';
import config from 'config';

import app from './app';

const { port, env } = config.get('general');

// configure port and listen for requests
const serverPort = parseInt(env === 'test' ? 8378 : port, 10) || 80;

const server = app.listen(port, () => {
  log(`Server is running on http://localhost:${serverPort} `);
});

export default server;

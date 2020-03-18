import Queue from 'bull';
import Redis, { RedisOptions } from 'ioredis';
import config from 'config';

const redisConfig: RedisOptions = config.get('redis');
const { name } = config.get('queue');

const client = new Redis(redisConfig);
const subscriber = new Redis(redisConfig);

const opts = {
  createClient: type => {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      default:
        return new Redis(redisConfig);
    }
  }
};

export default new Queue(name, opts);

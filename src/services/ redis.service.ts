/**
 * Redis Service module
 * @class RedisService
 * @developer Oyewole Abayomi Samuel
 */
import redis, { RedisClient, ClientOpts } from 'redis';
import config from 'config';
import { isNull } from 'lodash';

/**
 *
 *
 * @class RedisService
 * @developer Oyewole Abayomi Samuel
 */
class RedisService {
  redisClient: RedisClient;
  clientOpts: ClientOpts;

  constructor() {
    this.clientOpts = config.get('redis');
    this.redisClient = redis.createClient(this.clientOpts);
  }

  /**
   * store data
   * @param {string} access_key Unique key to store data
   * @param {object} payload object to store
   * @memberof RedisService
   */
  async store(accessKey: string, payload: object) {
    return new Promise((resolve, reject) => {
      try {
        const result = this.redisClient.set(accessKey, JSON.stringify(payload));
        // this.redisClient.expire(accessKey, 60 * 5); // 5 minutes to keep the token

        return resolve({ status: true, result });
      } catch (error) {
        return reject(new Error(error.message));
      }
    });
  }

  /**
   * retrieve data
   * @param {string} access_key Unique key to store data
   * @memberof RedisService
   */
  async retrive(accessKey: string): Promise<object | null> {
    return new Promise((resolve, reject) => {
      try {
        this.redisClient.get(accessKey, (err, result) => {
          if (result) {
            return resolve({ status: true, result: JSON.parse(result) });
          }
          return resolve(null);
        });
        return null;
      } catch (error) {
        return reject(new Error(error.message));
      }
    });
  }

  // update data
  /**
   *
   * @param {*} access_key
   * @param {*} newPayload
   * @memberof RedisService
   */
  async update(accessKey: string, newPayload: object) {
    return new Promise((resolve, reject) => {
      try {
        this.redisClient.get(accessKey, (err, result) => {
          if (isNull(result)) return reject(new Error(`${accessKey} does not exist!`));

          let payload = JSON.parse(result);
          payload = Object.assign(payload, newPayload);

          this.store(accessKey, payload);
          return resolve({ status: true, result });
        });
        return null;
      } catch (error) {
        return reject(new Error(error.message));
      }
    });
  }

  // clear data
  async remove(accessKey: string) {
    return new Promise((resolve, reject) => {
      try {
        const obj = this.redisClient.get(accessKey);
        if (isNull(obj)) return reject(new Error(`${accessKey} does not exist!`));

        this.redisClient.del(accessKey);
        return resolve({ status: true, message: `You've remove ${accessKey} successfully!` });
      } catch (error) {
        return reject(new Error(error.message));
      }
    });
  }

  getClientOpt(): ClientOpts {
    return this.clientOpts;
  }

  static getRedis() {
    return new RedisService();
  }
}

export default RedisService;

/* eslint-disable prefer-object-spread */
import Queue from 'bull';
import config from 'config';

import RedisService from './ redis.service';

import ICustomerResponse from '../interfaces/ICustomerResponse';
import { EProcessStage } from '../enums/EProcessStage';

const { name } = config.get('queue');
const redisService = new RedisService();

/**
 * Customer Service
 */
class CustomerService {
  data: string[][];
  queue: Queue.Queue<any> | undefined;
  processId: string;

  constructor(data: string[][], processId: string) {
    this.data = data;
    this.processId = processId;

    this.setupQueue();
  }

  public setupQueue() {
    this.queue = new Queue(name, redisService.getClientOpt());
  }

  public async processData(): Promise<ICustomerResponse> {
    if (this.queue === undefined) {
      throw new Error('Something went wrong, unable to access Queue!');
    }

    const payload = {
      data: this.data,
      processId: this.processId
    };

    const job = await this.queue.add(payload, { priority: 1 });

    const customerResponse = {
      processId: this.processId,
      stage: EProcessStage.Init,
      startTime: new Date(),
      endTime: null
    };

    RedisService.getRedis().store(
      this.processId,
      Object.assign({}, { ...customerResponse, job: job?.id })
    );
    return customerResponse;
  }
}

export default CustomerService;

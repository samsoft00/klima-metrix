/* eslint-disable prefer-object-spread */

import RedisService from './ redis.service';
import TaskQueue from '../queue/task.queue';

import ICustomerResponse from '../interfaces/ICustomerResponse';
import { EProcessStage } from '../enums/EProcessStage';

/**
 * Customer Service
 */
class CustomerService {
  data: string[][];
  processId: string;

  constructor(data: string[][], processId: string) {
    this.data = data;
    this.processId = processId;
  }

  public async processData(): Promise<ICustomerResponse> {
    const payload = {
      data: this.data,
      processId: this.processId
    };

    const job = await TaskQueue.add(payload, { priority: 1 });

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

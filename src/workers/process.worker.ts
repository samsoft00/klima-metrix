import Queue, { Job } from 'bull';
import config from 'config';
import throng from 'throng';
import async from 'async';
import log from 'fancy-log';

import { EProcessStage } from '../enums/EProcessStage';
import RedisService from '../services/ redis.service';
import IJobQueue from '../interfaces/IJobQueue';

import sanitizeData from '../lib/sanitizeData';

const redisService = new RedisService();

const { name, workers } = config.get('queue');

const maxJobsPerWorker = 50;

function start() {
  const workQueue = new Queue(name, redisService.getClientOpt());

  workQueue.process(maxJobsPerWorker, async (jobQueue: Job<IJobQueue>, done) => {
    const { data, processId } = jobQueue.data;

    log(`Worker with job ID ${jobQueue.id} started at ${new Date()}`);

    async.series(
      {
        stepOne: callback => {
          // Start process 1
          const payload = { stage: EProcessStage.Stage1 };

          setTimeout(async () => {
            await redisService.update(processId, payload);

            jobQueue.progress(20);
            callback(null, { ...payload, message: 'Process one completed' });
          }, 90000);
        },

        stepTwo: callback => {
          // Start process 2
          const payload = { stage: EProcessStage.Stage2 };

          setTimeout(async () => {
            await redisService.update(processId, payload);

            jobQueue.progress(40);
            callback(null, { ...payload, message: 'Process two completed' });
          }, 30000);
        },

        stepThree: callback => {
          // Start process 3
          const payload = { stage: EProcessStage.Stage3 };

          setTimeout(async () => {
            await redisService.update(processId, payload);

            jobQueue.progress(50);
            callback(null, { ...payload, message: 'Process three completed' });
          }, 80000);
        },

        stepFour: callback => {
          // Start process 4
          const payload = { stage: EProcessStage.Stage4 };

          setTimeout(async () => {
            await redisService.update(processId, payload);

            jobQueue.progress(60);
            callback(null, { ...payload, message: 'Process four completed' });
          }, 100000);
        },

        stepFive: callback => {
          // Start process 5
          const payload = { stage: EProcessStage.Stage5 };

          setTimeout(async () => {
            await redisService.update(processId, payload);

            jobQueue.progress(75);
            callback(null, { ...payload, message: 'Process five completed' });
          }, 70000);
        },

        stepSix: async callback => {
          // Start process 6
          await sanitizeData(data);

          const payload = { stage: EProcessStage.Stage6, endTime: new Date() };
          await redisService.update(processId, payload);

          jobQueue.progress(100);
          callback(null, { ...payload, message: 'Process six completed' });
        }
      },
      (err, result) => {
        log(`Worker with job ID ${jobQueue.id} ended at ${new Date()}`);
      }
    );

    done(null, { payload: {} });
  });
}

throng({ workers, start });

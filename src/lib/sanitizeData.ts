/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { Transform, TransformCallback } from 'stream';
import fromArray from 'from2-array';
import Fuse from 'fuse.js';
import log from 'fancy-log';

import ICompany from '../interfaces/ICompany';
import Database from './database';

class SanitizeData extends Transform {
  private dataTransform: Function;
  private concurrency: number;
  private terminateCallback: TransformCallback | null;
  private continueCallback: TransformCallback | null;
  private running: number = 0;

  constructor(concurrency: number, dataTransform: Function) {
    super({ objectMode: true });
    this.dataTransform = dataTransform;
    this.concurrency = concurrency;
    this.terminateCallback = null;
    this.continueCallback = null;
  }

  _transform(chunk: any, enc: string, done: TransformCallback) {
    this.running += 1;
    this.dataTransform(chunk, enc, this.push.bind(this), this._onComplete.bind(this));
    if (this.running < this.concurrency) {
      done();
    } else {
      this.continueCallback = done;
    }
  }

  _flush(done: TransformCallback) {
    if (this.running > 0) {
      this.terminateCallback = done;
    } else {
      done();
    }
  }

  // eslint-disable-next-line consistent-return
  _onComplete(err) {
    this.running -= 1;
    if (err) {
      return this.emit('error', err);
    }

    const tmpCallback = this.continueCallback;
    this.continueCallback = null;
    tmpCallback && tmpCallback();
    if (this.running === 0) {
      this.terminateCallback && this.terminateCallback();
    }
  }
}

// Rules
const options = {
  keys: [{ name: 'label', weight: 0.1, threshold: 0.0 }]
};

const fuse = new Fuse(Database.fetch(), options);

/**
 * Constructor revealing pattern
 */
export default (customerData: object[]) => {
  // Promise<ICompany[]>

  const output: object[] = [];

  fromArray
    .obj(customerData)
    .pipe(
      new SanitizeData(2, (data: any, enc, push, done) => {
        if (!data) return done();

        let company;
        const response: ICompany[] = fuse.search(data.name);

        if (response.length && response[0]) {
          // Found
          const firstData = response[0];
          company = Object.assign(data, { name: firstData.label });
        } else {
          company = data;
        }

        push(company);
        done();
        return null;
      })
    )
    .on('data', chunk => output.push(chunk))
    .on('error', err => log(new Error(err.message)))
    .on('end', () => Database.insert(output));
};

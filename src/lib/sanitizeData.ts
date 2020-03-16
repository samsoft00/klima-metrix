/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { Transform, TransformCallback } from 'stream';
import fromArray from 'from2-array';
import Fuse from 'fuse.js';

import ICompany from '../interfaces/ICompany';

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

  _transform(chunk: ICompany, enc: string, done: TransformCallback) {
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

const options = {
  keys: [{ name: 'name', weight: 0.1, threshold: 0.0 }]
};

const fuse = new Fuse(
  [
    { name: 'Klima.Metrix GmbH', type: 'suply' },
    { name: 'Abayomi Gm', type: 'suply' }
  ],
  options
);

export default (customerData: object[]) => {
  // Promise<ICompany[]>
  fromArray
    .obj(customerData)
    .pipe(
      new SanitizeData(2, (company: ICompany, enc, push, done) => {
        if (!company) return done();

        console.log(company);

        const response = fuse.search(company.name);

        if (response.length && response[0]) {
          // Found
          const { name } = response[0];
          push(Object.assign(company, name));
        } else {
          push(company);
        }

        done();
        return null;
      })
    )
    .on('data', info => console.log(info));
};
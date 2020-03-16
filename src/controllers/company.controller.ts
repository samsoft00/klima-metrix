import { Response, Request } from 'express';
import _ from 'lodash';

import CustomerService from '../services/customer.service';
import RedisService from '../services/ redis.service';
import parseCsvStream from '../lib/parseCsvStream';

class CompanyController {
  /**
   * POST /upload
   * Upload CSV file for processing.
   */

  // eslint-disable-next-line class-methods-use-this
  static async uploadCsvFile(req: any, res: Response) {
    const { mimetype, path, filename: processId } = req.file;

    if (mimetype !== 'text/csv') {
      return res
        .status(400)
        .json({ status: false, message: 'Wrong file upload, kindly upload Csv File' });
    }

    try {
      const dataRows = await parseCsvStream(path);

      const service = new CustomerService(dataRows, processId);
      const response = await service.processData();

      return res.status(200).json({
        status: true,
        ...response,
        message: 'Upload successful, wait while we process your data...'
      });
    } catch ({ message }) {
      return res.status(400).json({ status: false, message });
    }
  }

  /**
   * GET /upload/status/:process_id
   * Upload CSV file for processing.
   */

  // eslint-disable-next-line class-methods-use-this
  static async getUploadStatus(req: Request, res: Response) {
    const { processId } = req.params;

    try {
      const response = await RedisService.getRedis().retrive(processId);

      if (_.isNull(response)) {
        throw new Error('Upload process ID not found, check and try again!');
      }

      return res.status(200).json({ ...response });
    } catch ({ message }) {
      return res.status(400).json({ status: false, message });
    }
  }
}

export default CompanyController;

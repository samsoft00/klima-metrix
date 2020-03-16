import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import CompanyController from '../../controllers/company.controller';

const router = Router();

const Upload = multer({ dest: path.resolve('src/uploads/') });

router.post('/upload', Upload.single('file'), CompanyController.uploadCsvFile);

router.get('/upload/:processId', CompanyController.getUploadStatus);

export default router;

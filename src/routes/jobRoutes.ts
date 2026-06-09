import { Router } from 'express';
import { scheduleJob, getStatus } from '#controller/job.js';

const router = Router({ mergeParams: true });

router.post('/submit', scheduleJob);
router.get('/status/:id', getStatus);

export default router;

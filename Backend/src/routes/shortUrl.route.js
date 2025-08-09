import express from 'express';
import { createShortUrl } from '../controller/shortUrl.controller.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const router = express.Router();

router.post('/', wrapAsync(createShortUrl));
// router.post('/', wrapAsync(createCustomShortUrl));

export default router;

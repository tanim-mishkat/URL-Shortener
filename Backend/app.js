import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './src/config/mongo.config.js';
import shortUrlRouter from './src/routes/shortUrl.route.js';
import authRoutes from './src/routes/auth.route.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import { globalErrorHandler } from './src/middlewares/error.middleware.js';
import { notFoundHandler } from './src/middlewares/notFound.middleware.js';
import { wrapAsync } from './src/utils/wrapAsync.js';
import cors from 'cors';


dotenv.config({ path: './.env' });

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use('/api/create', shortUrlRouter);
app.use('/api/auth', authRoutes);
app.get('/:id', wrapAsync(redirectFromShortUrl));

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server running on http://localhost:${PORT}`);
});

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
import { attachUser } from './src/utils/attachUser.js';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/user.route.js';
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUser)

app.use('/api/create', shortUrlRouter);
app.use('/api/auth', authRoutes);
app.get('/:id', wrapAsync(redirectFromShortUrl));
app.use('/api/user', userRoutes);


app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server running on http://localhost:${PORT}`);
});

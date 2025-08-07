import express from 'express';
import { nanoid } from 'nanoid';
import connectToDB from './src/config/mongo.config.js';
import urlSchema from './src/models/shortUrl.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.post('/api/create', async (req, res) => {
    try {
        const { url } = req.body;
        const shortUrl = nanoid(7);
        const newUrl = new urlSchema({
            fullUrl: url,
            shortUrl: shortUrl,
        });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (error) {
        console.error("Error in POST /api/create:", error);
        res.status(500).json({ error: "Server error" });
    }
});


app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = await urlSchema.findOne({ shortUrl: id });
        if (url) {
            let redirectUrl = url.fullUrl;
            if (!/^https?:\/\//i.test(redirectUrl)) {
                redirectUrl = "http://" + redirectUrl;
            }
            res.redirect(redirectUrl);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error("Error in GET /:id:", error);
        res.status(500).json({ error: "Server error" });
    }
});




app.listen(PORT, () => {
    connectToDB();
    console.log(`Server running on http://localhost:${PORT}`);
});

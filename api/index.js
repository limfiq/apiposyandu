import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { supabase } from './configs/config.js'; // Import Supabase config dari file config.js
import kabupatenRoutes from './controllers/regency.js'; // Import routes kabupaten
import BeritaRoutes from './controllers/news.js';
import userRoutes from './controllers/users.js';
import anakRoutes from './controllers/child.js';
import periksaAnakRoutes from './controllers/childcheck.js'

dotenv.config();
const app = express();

// Menggunakan morgan untuk logging
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Menggunakan routes kabupaten
app.use('/regency', kabupatenRoutes);
app.use('/news', BeritaRoutes);
app.use('/users', userRoutes);
app.use('/child', anakRoutes);
app.use('/childcheck', periksaAnakRoutes);

// Server port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
});

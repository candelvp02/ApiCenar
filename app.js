import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './utils/db.js';
import { swaggerDocs } from './utils/swagger.js';
import { seedDatabase } from './utils/seed.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'qa';
dotenv.config({ path: `.env.${env}` });

const app = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', router);

app.use(errorHandler);


swaggerDocs(app);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

connectDB().then(async () => {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`ApiCenar running on port ${PORT} [${env}]`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });
});

export default app;
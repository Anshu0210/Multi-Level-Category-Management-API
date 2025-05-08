import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

// Start server
connectDB().then(() => {
	const port = process.env.PORT || 8000;
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
});

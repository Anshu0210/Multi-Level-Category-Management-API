import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(`${process.env.MONGO_URI}`);
		console.log('MongoDB connected successfully!');
	} catch (err) {
		console.error(`Mongodb connection error: ${err}`);
		process.exit(1);
	}
};

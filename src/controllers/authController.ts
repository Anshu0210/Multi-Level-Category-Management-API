import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'anglara';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, email, password, userType } = req.body;
		if (!name) throw new Error(`Please provide name`);
		if (!email) throw new Error(`Please provide email`);
		if (!userType) throw new Error(`Please provide userType`);
		if (!password) throw new Error(`Please provide password`);

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, username: email, password: hashedPassword, userType });
		await user.save();
		return res.status(201).json({ message: 'User registered successfully!!' });
	} catch (err: any) {
		let message = err.message;
		if (err.name === 'ValidationError') {
			message = Object.values(err.errors).map((value: any) => value.message);
		}

		return res.status(400).json({ error: message });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		if (!username) throw new Error(`Please provide username`);
		if (!password) throw new Error(`Please provide password`);

		const user = await User.findOne({ username, isActive: true });
		if (!user) throw new Error('User not found');

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw new Error('Invalid credentials');

		const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '4h' });
		return res.status(200).json({ token, user, message: "User login successfully!!" });
	} catch (err: any) {
		let message = err.message;
		if (err.name === 'ValidationError') {
			message = Object.values(err.errors).map((value: any) => value.message);
		}

		return res.status(400).json({ error: message });
	}
};

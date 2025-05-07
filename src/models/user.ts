import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	username: string;
	password: string;
	isActive: boolean;
	userType: string;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: [true, 'name is required'], minlength: [3, 'User name must be at least 3 characters long'] },
		email: { type: String, required: [true, 'email is required and must be unique'], unique: [true, 'this email already registered'] },
		username: { type: String, required: [true, 'username is required and must be unique'], unique: true },
		password: {
			type: String,
			required: [true, 'password is required'],
			minlength: [6, 'must be at least 6 characters long']
		},
		isActive: { type: Boolean, default: true },
		userType: { type: String, enum: ['admin', 'user'], required: true }
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);

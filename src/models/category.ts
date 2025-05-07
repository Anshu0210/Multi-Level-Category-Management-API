import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
	name: string;
	parent: mongoose.Types.ObjectId | null;
	createdBy: mongoose.Types.ObjectId | null;
	status: 'active' | 'inactive';
	isDeleted: boolean;
}
/**
 * Note :: when category parent id is not available that means this category is a parent category
 */
const categorySchema = new Schema<ICategory>(
	{
		name: {
			type: String,
			required: [true, 'Category name is required'],
			minlength: [5, 'Category name must be at least 5 characters long'],
			unique: [true, 'Category already exist!!']
		},
		parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
		status: { type: String, enum: ['active', 'inactive'], default: 'active' },
		isDeleted: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

categorySchema.index({ parent: 1, status: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);

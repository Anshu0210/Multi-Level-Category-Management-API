import { Request, Response } from 'express';
import { Category } from '../models/category';
import mongoose from 'mongoose';
import { buildTree, cleanMongooseTree } from '../utils/nodeTree';

export const createCategory = async (req: any | Request, res: Response): Promise<any> => {
  try {
    const { name, parent } = req.body;
    const category = new Category({ name, parent: parent || null, createdBy: req?.user?._id });
    await category.save();
    return res.status(201).json({ data: category, message: `Category created successfully!!` });
  } catch (err: any) {
    let message = err.message;
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map((value: any) => value.message);
    }

    return res.status(400).json({ error: message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    const categories: any = await Category.find();

    const tree = buildTree(categories);

    const clean = tree.map(cleanMongooseTree);

    if (!clean?.length) throw new Error(`Category not found!`);

    return res.json({ message: 'Category tree list found successfully!!', data: clean });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (name) category.name = name;
    if (status) category.status = status;

    await category.save();

    // active and inactive its all subcategory
    await inActiveWhileParentIsInactive(id, status);

    return res.status(200).json({ id, message: 'Category updated successfully!!' });
  } catch (err: any) {
    let message = err.message;
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map((value: any) => value.message);
    }

    return res.status(400).json({ error: message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');

    // When a parent category is deleted, all child categories should be reassigned to its parent
    await Category.updateMany({ parent: category._id }, { $set: { parent: category.parent } });

    // soft delete category
    await category.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isDeleted: true },
    );

    return res.status(204).json({ message: 'Category deleted successfully!!' });
  } catch (err: any) {
    let message = err.message;
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map((value: any) => value.message);
    }

    return res.status(404).json({ error: message });
  }
};

// use to inactive it's all sub category
const inActiveWhileParentIsInactive = async (id: string, status: string) => {
  const subCat = await Category.find({ parent: new mongoose.Types.ObjectId(id), status: status === 'inactive' ? 'active' : 'inactive' });

  if (subCat?.length) {
    for (let res of subCat) {
      await Category.updateMany({ parent: new mongoose.Types.ObjectId(id), status: status === 'inactive' ? 'active' : 'inactive' },
        { $set: { status: status } });

      const ids: any = res?._id;
      await inActiveWhileParentIsInactive(new mongoose.Types.ObjectId(ids).toString(), status);

    }
  } else {
    return true
  }
}

/**
 * this function use create category tree
 * @param categories
 * @returns
 */
const buildCategoryTree = (data: any[], key: string, parentId: number | null = null): any[] => {
  return data
    .filter(item => item[key] === parentId || (parentId === null && item[key] == null))
    .map(item => {
      const children = buildCategoryTree(data, key, item.id);
      return children.length ? { ...item, children } : item;
    });
}

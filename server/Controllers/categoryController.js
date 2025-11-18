const Category = require('../models/category');

const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json(category);
};

module.exports = { getCategories, createCategory };
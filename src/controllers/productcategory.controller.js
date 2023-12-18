import { productCategory } from "../models/productcategory.model.js";
import { Op } from 'sequelize';

export const getCategory_products = async (req, res) => {
    try {
        const arrayCategory_products = await productCategory.findAll()
        res.json(arrayCategory_products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getOneCategory_products = async (req, res) => {
    try {
        const { id } = req.params;
        const oneCategory_products = await productCategory.findOne({
            where: {
                ID_ProductCategory: id
            }
        });

        if (!oneCategory_products) return res.status(404).json({ message: 'Este id no existe' });
        res.json(oneCategory_products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const checkForDuplicates = async (req, res, next) => {
    try {
        const { Name_ProductCategory } = req.body;

        const existing = await productCategory.findOne({
            where: {
                [Op.or]: [{ Name_ProductCategory }],
            },
        });

        if (existing) {
            return res.status(400).json({
                error: 'Ya existe una categoria con el mismo nombre.',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createCategory_products = async (req, res) => {
    
    try {
        const { Name_ProductCategory } = req.body

        const newCategory_products = new productCategory({
            Name_ProductCategory,
            State: true,
        })
        
        await newCategory_products.save();
        res.json(newCategory_products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const disableCategory_products = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryProducts = await productCategory.findOne({
            where: {
                ID_ProductCategory: id
            }
        });

        if (!categoryProducts) {
            return res.status(404).json({ message: 'Insumo no encontrado' });
        }

        const updatedCategoryProduct = await categoryProducts.update({ State: !categoryProducts.State });

        res.json(updatedCategoryProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateCategory_products = async (req, res) => {

    try {
        const { id } = req.params;
        const { Name_ProductCategory } = req.body

        const updateCategory_products = await productCategory.findByPk(id)
        updateCategory_products.Name_ProductCategory = Name_ProductCategory;

        await updateCategory_products.save();
        res.json(updateCategory_products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteCategory_products = async (req, res) => {
    try {
        const { id } = req.params;

        await productCategory.destroy({
            where: {
                ID_ProductCategory: id,
            },
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getCategoriesProducts = async (req, res) => {
    try {
        const products = await productCategory.findAll({
            where: {
                State: 1
            }
        });
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
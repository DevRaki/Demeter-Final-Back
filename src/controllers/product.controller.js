import { product } from '../models/product.model.js';
import { productDetail } from '../models/productdetail.model.js';
import { supplies } from '../models/supplies.model.js';
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
    try {
        const products = await product.findAll()
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const checkForDuplicates = async (req, res, next) => {
    try {
        const { Name_Products } = req.body;

        const existingProduct = await product.findOne({
            where: {
                [Op.or]: [{ Name_Products}],
            },
        });

        if (existingProduct) {
            return res.status(400).json({
                error: 'Ya existe un producto con el mismo nombre y/o imagen.',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const { Name_Products,  Price_Product, ProductCategory_ID } = req.body;

    try {
        const newProduct = await product.create({
            Name_Products,
            Price_Product,
            ProductCategory_ID,
            State: false
        })

        res.json(newProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { Name_Products, Image, Price_Product, ProductCategory_ID } = req.body

        const updateProduct = await product.findByPk(id)

        updateProduct.Name_Products = Name_Products
        updateProduct.Image = Image
        updateProduct.Price_Product = Price_Product
        updateProduct.ProductCategory_ID = ProductCategory_ID

        await updateProduct.save()

        res.json(updateProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleProductStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const statusProduct = await product.findOne({
            where: { ID_Product: id },
        });

        if (!statusProduct) {
            return res.status(404).json({ message: 'El producto no se encontro' });
        };

        statusProduct.State = !statusProduct.State;

        await statusProduct.save();

        return res.json(statusProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const products = await product.findAll({
            where: {
                ProductCategory_ID: id,
                State: 1 // Agrega esta condición
            }
        });
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const {id} = req.params
        const products = await product.findOne({where: {ID_Product : id}})
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllProduct = async (req, res) => {
    try {
        const products = await product.findAll()
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        await product.destroy({
            where: { ID_Product: id, }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Deatlles del producto

export const getDetailsPByProduct = async (req, res) => {
    const { id } = req.params

    try {
        const getProduct = await product.findOne({
            where: { ID_Product: id }
        })
        const getDetailsPByProduct = await productDetail.findOne({
            where: { Product_ID: id }
        })

        if (!getDetailsPByProduct) return res.status(404).json({ message: 'No exite el producto.' })

        res.json(getProduct, getDetailsPByProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getDetailProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const productDetails = await productDetail.findAll({
            where: { Product_ID: id },
            include: [
                {
                    model: product,
                    attributes: ['ID_Product', 'Name_Products',],
                },
                {
                    model: supplies,
                    attributes: ['ID_Supplies', 'Name_Supplies', 'measure'  ], // Agrega los campos necesarios
                },
            ],
        });

        if (!productDetails) {
            return res.status(404).json({ message: 'No existen detalles para el producto.' });
        }

        res.json(productDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createDetailP = async (req, res) => {
    

    try {
        const { Supplies_ID,  Lot_ProductDetail, id } = req.body

        const supplie = await supplies.findByPk(Supplies_ID);
        if (!supplie) {
            return res.status(404).json({ message: 'El insumo no existe' });
        }

        const createDetail = await productDetail.create({
            Product_ID: id,
            Supplies_ID: Supplies_ID,
            Lot_ProductDetail : Lot_ProductDetail,
            State: true
        })
        res.json(createDetail);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteDetailProduct = async (req, res) => {
    try {
        const { id } = req.params

        await productDetail.destroy({
            where: { ID_ProductDetail: id, }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getDetailProduct2 = async (req, res) => {
    const { id } = req.params;

    try {
        const productDetails = await productDetail.findAll({
            attributes: ['Lot_ProductDetail', 'Supplies_ID', 'Product_ID'],
            where: { Product_ID: id },
        });

        if (!productDetails || productDetails.length === 0) {
            return res.status(404).json({ message: 'No existen detalles para el producto.' });
        }

        for (const detail of productDetails) {
            const suppliesID = detail.Supplies_ID;
            const lot = detail.Lot_ProductDetail;

            const supply = await supplies.findByPk(suppliesID);

            if (!supply) {
                return res.status(404).json({ message: 'No se encontró el suministro asociado al detalle del producto.' });
            }

            const newUnit = supply.Unit - (lot/2);

            await supply.update({ Unit: newUnit });
        }

        res.json(productDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
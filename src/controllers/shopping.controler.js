import { sequelize } from '../db/dataBase.js';
import { shopping } from '../models/shopping.model.js'
import { shoppingDetail } from '../models/shoppingdetail.model.js';
import { supplier } from '../models/supplier.model.js';
import { supplies } from '../models/supplies.model.js';
import { updateUnitSupplieById } from './supplies.controller.js';

export const getShopping = async (req, res) => {
    try {
        const ArrayShopping = await shopping.findAll();
        res.json(ArrayShopping);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShop = async (req, res) => {
    const { id } = req.params;
    try {
        const oneShop = await shopping.findOne({
            where: {
                ID_Shopping: id
            }
        });
        res.json(oneShop);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createShopping = async (req, res) => {
    try {
        const { Datetime, Total, State } = req.body;

        const createShopping = await shopping.create({
            Datetime,
            Total,
            State
        });

        res.json(createShopping);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShopingAndShopingDetails = async (req, res) => {
    try {

        const shoppingAndShoppingDetails = await shoppingDetail.findAll({
            include: [{
                model: shopping,
                required: true,
                include: [{
                    model: supplier,
                    required: true
                }]
            }],
        })

        res.json(shoppingAndShoppingDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShoppingAndSuppliesBySupplierId = async (req, res) => {
    try {

        const { id } = req.params
        const shoppingAndShoppingDetails = await shoppingDetail.findAll({
            include: [
                {
                    model: shopping,
                    where: {
                        Supplier_ID: id
                    },
                    required: true
                },
                {
                    model: supplies,
                    required: true
                }
            ]
        })

        res.json(shoppingAndShoppingDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShoppingAndSuppliesBySupplierIdAndDateTime = async (req, res) => {
    try {

        const { id, date } = req.params
        const shoppingAndShoppingDetails = await shoppingDetail.findAll({
            include: [
                {
                    model: shopping,
                    where: {
                        Supplier_ID: id,
                        Datetime: date
                    },
                    required: true
                },
                {
                    model: supplies,
                    required: true
                }
            ]
        })

        res.json(shoppingAndShoppingDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShoppingAndSuppliesBySupplierIdAndDate = async (req, res) => {
    try {

        const { id, date } = req.params
        const shoppingAndShoppingDetails = await shoppingDetail.findAll({
            include: [
                {
                    model: shopping,
                    where: {
                        Supplier_ID: id,
                        // Datetime: date
                    },
                },
                {
                    model: supplies,
                }
            ]
        })

        res.json(shoppingAndShoppingDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShopingByProvider = async (req, res) => {
    try {

        const shoppingBySupplier = await shopping.findAll({
            include: [{
                model: supplier,
                required: true
            }],
        })

        res.json(shoppingBySupplier);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const createMultipleShopping = async (req, res) => {
    try {
        const data = Array.from(req.body);
        const dataInserted = []
        const date = new Date()

        for await (const { Invoice_Number, Total, State, Supplier_ID, User_ID, shoppingDetails } of data) {
            const createdShopping = await shopping.create({
                Datetime: date,
                Invoice_Number,
                Total,
                State,
                Supplier_ID,
                User_ID
            });

            const createdShoppingDetail = await shoppingDetail.create({
                ...shoppingDetails,
                Shopping_ID: createdShopping.ID_Shopping
            })

            const supplyUpdated = await updateUnitSupplieById(createdShoppingDetail.Supplies_ID, shoppingDetails.Lot)

            dataInserted.push({ createdShopping, createdShoppingDetail, supplyUpdated })
        }

        res.json(dataInserted);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const disableShop = async (req, res) => {
    try {
        const { id } = req.params;

        const shop = await shopping.findOne({
            where: {
                ID_Shopping: id
            }
        });

        if (!shop) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        const updatedShop = await shop.update({ State: !shop.State });

        res.json(updatedShop);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getShoppingByDate = async (req, res) => {
    try {
      const shoppingByDate = await shopping.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('Datetime')), 'shoppingDate'],
          [sequelize.fn('COUNT', sequelize.col('*')), 'totalShopping'],
          [sequelize.fn('SUM', sequelize.col('Total')), 'totalAmount'],
        ],
        group: [sequelize.fn('DATE', sequelize.col('Datetime'))],
        raw: true,
      });
  
      res.json(shoppingByDate);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
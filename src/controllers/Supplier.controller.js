import {supplier} from '../models/supplier.model.js'

export const getSupplier = async (req, res) => {
    try {
        const ArraySupplier = await supplier.findAll();
        res.json(ArraySupplier);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getSupplie = async (req, res) => {
    const { id } = req.params;
    try {                                                                                                                 
        const oneSupplier = await supplier.findOne({
            where: {
                ID_Supplier: id
            }
        });
        res.json(oneSupplier);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createSupplier = async (req, res) => {
    try {
        const { Type_Document, Document, Name_Business, Name_Supplier, Phone, Email, City } = req.body;

        const createSupplier = await supplier.create({
            Type_Document,
            Document,
            Name_Supplier,
            Name_Business,
            Phone,
            Email, 
            City,
            State: true
        });

        res.json(createSupplier);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const disableSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const supply = await supplier.findOne({
            where: {
                ID_Supplier: id
            }
        });

        if (!supply) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        const updatedSupply = await supply.update({ State: !supply.State });

        res.json(updatedSupply);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const updateSupplier = async (req, res) => { 
    const { id } = req.params;
    try {
        const updateSupplier = await supplier.findOne({
            where: {
                ID_Supplier: id
            }
        });

        updateSupplier.set(req.body);
        await updateSupplier.save();
        return res.json(updateSupplier);           
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    
    try {
        const { id } = req.params;
        
        const existSupplirInShoppings = await shopping.findOne({
            where: {
                Supplier_ID: id
            }
        })

        if (existSupplirInShoppings) {
            return res.status(403).json({
                message: "El provedor no puede ser eliminado",
                useDelete: false
            })
        }
        await supplier.destroy({
            where: {
                ID_Supplier: id
            }
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
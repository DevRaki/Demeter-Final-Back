import { DataTypes } from "sequelize";
import { sequelize } from "../db/dataBase.js";
import { saleDetail } from './saledetail.model.js'

export const sale = sequelize.define('Sales', {

    ID_Sale:{
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },

    StatePay: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado de pago es requerido'
            }
        }
    },

    Datetime: {
        type: DataTypes.DATE, 
        allowNull: false,
        validate: {
            notNull:{
                msg: "La fecha es requerido"
            }
        }
    },

    QuickSale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
            notNull:{
                msg: "El estado de venta rapida es requerido"
            }
        }
    },

    Discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull:{
                msg: "El descuento es requerido"
            }
        }
    },

    SubTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull:{
                msg: "El subtotal es requerido"
            }
        }
    },

    Total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            notNull:{
                msg: "El precio del producto es requerido"
            }, 
            isInt: true
        }
    },

    Payment: {
        type: DataTypes.STRING(30),
        allowNull: false, 
        validate: {
            notNull:{
                msg: "El metodo de pago es requerido"
            }, 
            customValidate(value) {
                if (!/^[A-Za-z\s()]+$/.test(value)) {
                    throw new Error('La medida del insumo puede contener letras, espacios y paréntesis.');
                }
            }
        },
    },

    State: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado de la venta es requerido'
            }
        }
    }
}, {
    timestamps: false
});

sale.hasMany(saleDetail, {
<<<<<<< Updated upstream
    foreignKey: {
        name: 'Sale_ID',
        allowNull: false,
    },
    sourceKey: 'ID_Sale',
})

saleDetail.belongsTo(sale, {
    foreignKey: {
        name: 'Sale_ID',
        allowNull: false,
    },
    targetKey: 'ID_Sale',
=======
    foreignKey: 'Sale_ID',
    sourceKey: 'ID_Sale'
})

saleDetail.belongsTo(sale, {
    foreignKey: 'Sale_ID',
    targetKey: 'ID_Sale'
>>>>>>> Stashed changes
})
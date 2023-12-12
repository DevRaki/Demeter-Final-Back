import { DataTypes } from "sequelize";
import { sequelize } from "../db/dataBase.js";
import { supplies } from './supplies.model.js'

export const suppliesCategory = sequelize.define('SuppliesCategorys', {

    ID_SuppliesCategory: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Name_SuppliesCategory: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El nombre es requerido"
            },
            customValidate(value) {
                if (!/^[A-ZÑñ][a-zA-ZÑñ\s]*$/.test(value)) {
                    throw new Error('Se debe comenzar con mayúscula y puede contener letras, espacios y la letra "ñ".');
                }
            }
        }
    },

    State: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado es requerido'
            }
        }
    }
}, {
    timestamps: false
});

suppliesCategory.hasMany(supplies, {
    foreignKey: {
        name: 'SuppliesCategory_ID',
        allowNull: false,
    },
    sourceKey: 'ID_SuppliesCategory'
})
supplies.belongsTo(suppliesCategory, {
    foreignKey: {
        name: 'SuppliesCategory_ID',
        allowNull: false,
    },
    targetKey: 'ID_SuppliesCategory'
})

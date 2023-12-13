import { DataTypes } from "sequelize";
import { sequelize } from "../db/dataBase.js";
import { modulePermission } from "./modulePermission.model.js";

export const module = sequelize.define('Modules', {

    ID_Module: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Name_Module: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El nombre es requerido"
            }
        }
    }

}, {
    timestamps: false
});

module.hasMany(modulePermission, {
    foreignKey: {
        name: 'Module_ID',
        allowNull: false,
    },
    sourceKey: 'ID_Module'
})
modulePermission.belongsTo(module, {
    foreignKey: {
        name: 'Module_ID',
        allowNull: false,
    },
    targetKey: 'ID_Module'
})
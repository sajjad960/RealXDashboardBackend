import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";
import Product from "./productModel";

const ProductLog = sequelize.define('products_logs', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  product_views: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'products_logs',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "id" },
      ]
    },
    {
      name: "id_idx",
      using: "BTREE",
      fields: [
        { name: "product_id" },
      ]
    },
  ]
});

ProductLog.belongsTo(Product, {foreignKey: "product_id", as: "product_details"})
Product.hasOne(ProductLog, {foreignKey: "product_id", as: "product_details"})

export = ProductLog;

import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";
import User from "./userModel";
import ProductLog from "./productLogModel";

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  models: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  poster: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  tableName: 'products',
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
      name: "user_idx",
      using: "BTREE",
      fields: [
        { name: "user_id" },
      ]
    },
  ]
});

Product.belongsTo(User, {foreignKey: "user_id", as: "product_user_details"})
User.hasMany(Product, {foreignKey: "user_id", as: "product_user_details"})

Product.hasOne(ProductLog, {foreignKey: "product_id", as: "product_log_details"})
ProductLog.belongsTo(Product, {foreignKey: "product_id", as: "product_log_details"})

export = Product;

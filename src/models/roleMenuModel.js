const { DataTypes } = require("sequelize");
const sequelize = require("../../modules/sequelize");
const Role = require("./roleModel");
const Menu = require("./menuModel");

const RoleMenu = sequelize.define(
  "RoleMenu",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "role_menus",

    /* 👇 Sequelize will auto manage these */
    timestamps: true,

    /* 👇 Match DB column names */
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

/* Sync (dev only) */
RoleMenu.sync()
    .then(() => {
        console.log("RoleMenu table has been created.");
    })
    .catch((error) => {
        console.error("Error creating RoleMenu table:", error);
    });

module.exports = RoleMenu
const Role = require("./roleModel");
const Menu = require("./menuModel");
const RoleMenu = require("./roleMenuModel");
const DispenseHistory = require("./dispenseHistory");
const School = require("./schoolDetails");

/* =====================
   MANY TO MANY
===================== */
Role.belongsToMany(Menu, {
  through: RoleMenu,
  foreignKey: "roleId",
  otherKey: "menuId"
});

Menu.belongsToMany(Role, {
  through: RoleMenu,
  foreignKey: "menuId",
  otherKey: "roleId"
});

// 🔗 Correct relation
DispenseHistory.belongsTo(School, {
  foreignKey: "machineId",
  targetKey: "machineId",
  as: "school",
});

School.hasMany(DispenseHistory, {
  foreignKey: "machineId",
  sourceKey: "machineId",
  as: "dispenseHistories",
});

/* =====================
   DIRECT (optional)
===================== */
Menu.hasMany(RoleMenu, { foreignKey: "menuId" });
RoleMenu.belongsTo(Menu, { foreignKey: "menuId" });

Role.hasMany(RoleMenu, { foreignKey: "roleId" });
RoleMenu.belongsTo(Role, { foreignKey: "roleId" });

module.exports = {
  Role,
  Menu,
  RoleMenu,
  School,
  DispenseHistory,
};

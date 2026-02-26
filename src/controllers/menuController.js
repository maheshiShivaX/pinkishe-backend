const Menu = require("../models/menuModel");
const { Op } = require("sequelize");
const { Role } = require("../models");

/* =======================
   CREATE / UPDATE MENU
======================= */
const createMenu = async (req, res) => {
    const { id = 0, name, parentId = null, orderNo = 0, icon = null, url = null, level = null } = req.body;

    if (!name) {
        return res.status(400).json({
            status: false,
            message: "Menu name is required"
        });
    }

    const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");

    try {
        /* =======================
           UPDATE MENU
        ======================= */
        if (Number(id) > 0) {
            const menu = await Menu.findOne({
                where: { id, isDeleted: false }
            });

            if (!menu) {
                return res.status(404).json({
                    status: false,
                    message: "Menu not found"
                });
            }

            // Duplicate slug check (exclude current menu)
            const duplicate = await Menu.findOne({
                where: {
                    slug,
                    isDeleted: false,
                    id: { [Op.ne]: id }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    status: false,
                    message: "Menu already exists"
                });
            }

            await menu.update({
                name,
                slug,
                url,
                icon,
                parentId,
                orderNo,
                level
            });

            return res.status(200).json({
                status: true,
                message: "Menu updated successfully"
            });
        }

        /* =======================
           CREATE MENU
        ======================= */
        const existingMenu = await Menu.findOne({
            where: { slug, isDeleted: false }
        });

        if (existingMenu) {
            return res.status(409).json({
                status: false,
                message: "Menu already exists"
            });
        }

        const menu = await Menu.create({
            name,
            slug,
            url,
            icon,
            parentId,
            orderNo,
            level
        });

        return res.status(201).json({
            status: true,
            message: "Menu created successfully",
            data: menu
        });

    } catch (error) {
        console.error("Menu save error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

const getMenus = async (req, res) => {
    try {
        const roleId = req.user.roleId;

        const menus = await Menu.findAll({
            include: [
                {
                    model: Role,
                    where: { id: roleId },
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            where: { isDeleted: false },
            order: [
                ["parentId", "ASC"],
                ["orderNo", "ASC"]
            ],
            raw: true
        });

        const map = {};
        const tree = [];

        menus.forEach(m => {
            map[m.id] = { ...m, children: [] };
        });

        menus.forEach(m => {
            if (m.parentId && map[m.parentId]) {
                map[m.parentId].children.push(map[m.id]);
            } else {
                tree.push(map[m.id]);
            }
        });

        return res.json({ status: true, data: tree });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Failed to load menus" });
    }
};


module.exports = {
    createMenu,
    getMenus
};

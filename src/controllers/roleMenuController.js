const RoleMenu = require("../models/roleMenuModel");

/* ==============================
   CREATE OR UPDATE (SINGLE API)
================================ */
const saveRoleMenu = async (req, res) => {
    try {
        const { id, roleId, menuId } = req.body;

        if (!roleId || !menuId) {
            return res.status(400).json({
                status: false,
                message: "roleId and menuId are required"
            });
        }

        // UPDATE
        if (id && id > 0) {
            const record = await RoleMenu.findByPk(id);
            if (!record) {
                return res.status(404).json({
                    status: false,
                    message: "Record not found"
                });
            }

            await record.update({ roleId, menuId });

            return res.json({
                status: true,
                message: "Role menu updated successfully"
            });
        }

        // CREATE (CHECK DUPLICATE)
        const exists = await RoleMenu.findOne({
            where: { roleId, menuId }
        });

        if (exists) {
            return res.status(409).json({
                status: false,
                message: "Menu already assigned to this role"
            });
        }

        await RoleMenu.create({ roleId, menuId });

        return res.json({
            status: true,
            message: "Role menu created successfully"
        });

    } catch (error) {
        console.error("saveRoleMenu error:", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};

// const getAllRoleMenus = async (req, res) => {
//     try {
//         const data = await RoleMenu.findAll({
//             order: [["id", "DESC"]]
//         });

//         res.json({
//             status: true,
//             data
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Failed to fetch role menus"
//         });
//     }
// };

// const getRoleMenuById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const data = await RoleMenu.findByPk(id);
//         if (!data) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Record not found"
//             });
//         }

//         res.json({
//             status: true,
//             data
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Failed to fetch record"
//         });
//     }
// };

// const deleteRoleMenu = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const record = await RoleMenu.findByPk(id);
//         if (!record) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Record not found"
//             });
//         }

//         await record.destroy();

//         res.json({
//             status: true,
//             message: "Role menu deleted successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Failed to delete record"
//         });
//     }
// };

module.exports = {
    saveRoleMenu
    
};


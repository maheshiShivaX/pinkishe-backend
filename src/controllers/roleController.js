const { Op } = require("sequelize");
const Role = require("../models/roleModel");

/* Helper functions */
const formatDisplayName = (name) =>
    name
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const formatRoleName = (name) =>
    name.toLowerCase().replace(/\s+/g, "");

const saveRole = async (req, res) => {
    const { id, displayName } = req.body;

    if (!displayName) {
        return res.status(400).json({
            message: "displayName is required"
        });
    }

    // Auto formatting
    const formattedDisplayName = formatDisplayName(displayName);
    const roleName = formatRoleName(displayName);

    try {
        /* =======================
           UPDATE ROLE
        ======================= */
        if (id && Number(id) > 0) {

            const role = await Role.findOne({
                where: { id, isDeleted: false }
            });

            if (!role) {
                return res.status(404).json({
                    status: false,
                    message: "Role not found"
                });
            }

            // Duplicate check (excluding current role)
            const duplicate = await Role.findOne({
                where: {
                    roleName,
                    isDeleted: false,
                    id: { [Op.ne]: id }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    status: false,
                    message: "Role already exists"
                });
            }

            await role.update({
                roleName,
                displayName: formattedDisplayName
            });

            return res.status(200).json({
                status: true,
                message: "Role updated successfully",
                // data: role
            });
        }

        /* =======================
           CREATE ROLE
        ======================= */
        const existingRole = await Role.findOne({
            where: { roleName, isDeleted: false }
        });

        if (existingRole) {
            return res.status(409).json({
                status: false,
                message: "Role already exists"
            });
        }

        const role = await Role.create({
            roleName,
            displayName: formattedDisplayName
        });

        return res.status(201).json({
            status: true,
            message: "Role created successfully",
            // data: role
        });

    } catch (error) {
        console.error("Error saving role:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

/* =======================
   GET ALL ACTIVE ROLES
======================= */
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            where: { isDeleted: false },
            order: [["id", "DESC"]] // optional
        });

        return res.status(200).json({
            status: true,
            data: roles
        });

    } catch (error) {
        console.error("Error fetching roles:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};


/* =======================
   GET ROLE BY ID
======================= */
const getRoleById = async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findOne({
            where: { id, isDeleted: false }
        });

        if (!role) {
            return res.status(404).json({
                status: false,
                message: "Role not found"
            });
        }

        return res.status(200).json({
            status: true,
            data: role
        });

    } catch (error) {
        console.error("Error fetching role:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

/* =======================
   DELETE ROLE (SOFT)
======================= */
const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findOne({
            where: { id, isDeleted: false }
        });

        if (!role) {
            return res.status(404).json({
                status: false,
                message: "Role not found"
            });
        }

        await role.update({ isDeleted: true });

        return res.status(200).json({
            status: true,
            message: "Role deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting role:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    saveRole,
    getAllRoles,
    getRoleById,
    deleteRole
};

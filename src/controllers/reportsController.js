const { Op, fn, col, literal } = require("sequelize");
const DispenseHistory = require("../models/dispenseHistory");
const School = require("../models/schoolDetails");
const Machine = require("../models/vendingMachine");

/* =================================================
   MACHINE WISE DISPENSE & UTILIZATION
================================================= */
exports.machineWiseDispense = async (req, res) => {
  try {
    const {
      states = [],
      districts = [],
      startDate,
      endDate,
      dispenseType = "all" // all | manual | machine
    } = req.body;

    const where = {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (dispenseType !== "all") {
      where.type = dispenseType;
    }

    const data = await DispenseHistory.findAll({
      attributes: [
        "machineId",
        [fn("SUM", col("pads_dispensed")), "padsDispensed"]
      ],
      include: [{
        model: School,
        attributes: ["state", "district", "schoolName", "numberOfGirls"],
        where: {
          ...(states.length && { state: states }),
          ...(districts.length && { district: districts })
        }
      }],
      group: ["machineId", "School.id"]
    });

    const result = data.map(row => {
      const girls = row.School.numberOfGirls || 1;
      return {
        machineId: row.machineId,
        state: row.School.state,
        district: row.School.district,
        schoolName: row.School.schoolName,
        supportedGirls: girls,
        padsDispensed: row.get("padsDispensed"),
        avgConsumption: (row.get("padsDispensed") / girls).toFixed(2)
      };
    });

    res.json({ status: true, data: result });

  } catch (error) {
    console.error("machineWiseDispense", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.stateDistrictComparison = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const data = await DispenseHistory.findAll({
      attributes: [
        [col("School.state"), "state"],
        [col("School.district"), "district"],
        [fn("SUM", col("pads_dispensed")), "totalPads"]
      ],
      include: [{ model: School, attributes: [] }],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      group: ["School.state", "School.district"]
    });

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false });
  }
};

exports.machineDispenseRefill = async (req, res) => {
  try {
    const data = await Machine.findAll({
      attributes: [
        "id",
        "machineCode",
        [literal("(SELECT SUM(pads_dispensed) FROM dispense_histories WHERE machineId = Machine.id)"), "padsDispensed"],
        [literal("(SELECT COUNT(*) FROM refill_histories WHERE machineId = Machine.id)"), "totalRefills"]
      ]
    });

    res.json({ status: true, data });
  } catch (e) {
    res.status(500).json({ status: false });
  }
};

exports.reportSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const summary = await DispenseHistory.findOne({
      attributes: [
        [fn("COUNT", literal("DISTINCT machineId")), "machines"],
        [fn("COUNT", literal("DISTINCT School.id")), "schools"],
        [fn("SUM", col("pads_dispensed")), "totalPads"]
      ],
      include: [{ model: School, attributes: [] }],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    });

    res.json({ status: true, data: summary });
  } catch (err) {
    res.status(500).json({ status: false });
  }
};

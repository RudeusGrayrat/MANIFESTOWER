const Contract = require("../../models/Contracts");
const Employee = require("../../models/Employees/Employee");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getContratosPaginacion = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");
      const colaboradores = await Employee.find({
        $or: [
          { name: regex },
          { lastname: regex },
          { business: regex },
          { charge: regex },
        ],
      }).select("_id");
      const colaboradoresIds = colaboradores.map((c) => c._id);
      query.$or = [
        { colaborador: { $in: colaboradoresIds } },
        { state: regex },
        { typeContract: regex },
        { dateStart: regex },
        { dateEnd: regex },
        { regimenPension: regex },
        { codigoSpp: regex },
      ];
    }
    // Ejecutar consultas en paralelo: datos paginados y total de coincidencias
    const [data, total] = await Promise.all([
      Contract.find(query)
        .populate("colaborador", "name lastname business charge")
        .skip(page * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean(),
      Contract.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al buscar Contratos",
    });
  }
};

module.exports = getContratosPaginacion;

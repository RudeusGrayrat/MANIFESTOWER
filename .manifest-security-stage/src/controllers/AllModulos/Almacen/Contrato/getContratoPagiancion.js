const ContratoAlmacen = require("../../../../models/AllModulos/Almacen/Contrato");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getContratoAlmacenPagination = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");

      // Buscar coincidencias por
      query.$or = [
        { cliente: regex },
        { estado: regex },
        { fechaInicio: regex },
        { fechaFin: regex },
      ];
    }

    // Ejecutar consultas en paralelo: datos paginados y total de coincidencias
    const [data, total] = await Promise.all([
      ContratoAlmacen.find(query)
        .populate("sedeId", "nonmbre") // 🔎 trae también el nombre del almacén
        .skip(page * limit)
        .limit(parseInt(limit))
        .lean()
        .sort({ createdAt: -1 }),
      ContratoAlmacen.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error al buscar Zonas" });
  }
};

module.exports = getContratoAlmacenPagination;

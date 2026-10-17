const Zona = require("../../../../models/AllModulos/Almacen/Zona");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getZonaPagination = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");

      // Buscar coincidencias por nombre de zona o por orientacion
      query.$or = [{ nombre: regex }, { orientacion: regex }];
    }

    // Ejecutar consultas en paralelo: datos paginados y total de coincidencias
    const [data, total] = await Promise.all([
      Zona.find(query)
        .populate("almacenId", "nombre") // 🔎 trae también el nombre del almacén
        .skip(page * limit)
        .limit(parseInt(limit))
        .lean()
        .sort({ createdAt: -1 }),
      Zona.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    console.error("Error al buscar Zonas:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error al buscar Zonas" });
  }
};

module.exports = getZonaPagination;

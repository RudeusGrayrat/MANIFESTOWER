const Almacen = require("../../../../models/AllModulos/Almacen/Almacen");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getNavesPagination = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");

      // 🔎 Buscar en campos de Almacen y también en nombre de la sede
      query.$or = [
        { nombre: regex },
        { descripcion: regex },
        // no se puede filtrar directo por sede.nombre, se hace con populate + pipeline o con un lookup
      ];
    }

    // Ejecutar consultas en paralelo: datos y total
    const [data, total] = await Promise.all([
      Almacen.find(query)
        .populate("sedeId", "nombre") // traemos el nombre de la sede
        .skip(page * limit)
        .limit(parseInt(limit))
        .lean()
        .sort({ createdAt: -1 }),
      Almacen.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    console.error("Error al buscar Naves:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error al buscar Naves" });
  }
};

module.exports = getNavesPagination;

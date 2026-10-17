const InventarioSistemas = require("../../../../models/AllModulos/SISTEMAS/Inventario/Inventario");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getInventarioPagination = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");

      // Buscar coincidencias por
      query.$or = [
        { codigo: regex },
        { categoria: regex },
        { marca: regex },
        { modelo: regex },
        { especificaciones: regex },
        { area: regex },
        { sede: regex },
        { cantidad: regex },
        { estado: regex },
        { observaciones: regex },
      ];
    }

    // Ejecutar consultas en paralelo: datos paginados y total de coincidencias
    const [data, total] = await Promise.all([
      InventarioSistemas.find(query)
        .skip(page * limit)
        .limit(parseInt(limit))
        .lean()
        .sort({ createdAt: -1 }),
      InventarioSistemas.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al buscar Inventario de Sistemas",
    });
  }
};

module.exports = getInventarioPagination;

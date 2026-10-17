const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSedePagination = async (req, res) => {
  try {
    const { page = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      const regex = new RegExp(safeSearch, "i");

      // Buscamos coincidencias en varios campos de la sede
      query.$or = [
        { nombre: regex },
        { direccion: regex },
        { ciudad: regex },
        { departamento: regex },
        { pais: regex },
        { estado: regex },
      ];
    }

    // Ejecutar consultas en paralelo: datos + total
    const [data, total] = await Promise.all([
      Sede.find(query)
        .skip(page * limit)
        .limit(parseInt(limit))
        .lean()
        .sort({ createdAt: -1 }),
      Sede.countDocuments(query),
    ]);

    return res.json({ data, total });
  } catch (error) {
    console.error("Error al buscar Sedes:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error al buscar Sedes" });
  }
};

module.exports = getSedePagination;

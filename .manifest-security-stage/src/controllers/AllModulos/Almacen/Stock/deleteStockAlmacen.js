const StockAlmacen = require("../../../../models/AllModulos/Almacen/Stock");

const deleteStockAlmacen = async (req, res) => {
  const { _id } = req.body;
  try {
    // Eliminar la boleta de pago
    const StockFound = await StockAlmacen.findByIdAndDelete(_id);
    if (!StockFound) {
      return res.status(400).json({ message: "Stock no existe" });
    }
    return res.status(200).json({
      message: "Stock eliminado exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteStockAlmacen;

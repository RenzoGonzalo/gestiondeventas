"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovement = void 0;
class StockMovement {
    constructor(id, companyId, variantId, tipo, cantidad, stockAnterior, stockNuevo, motivo, saleId, usuarioId, createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.variantId = variantId;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.stockAnterior = stockAnterior;
        this.stockNuevo = stockNuevo;
        this.motivo = motivo;
        this.saleId = saleId;
        this.usuarioId = usuarioId;
        this.createdAt = createdAt;
    }
}
exports.StockMovement = StockMovement;

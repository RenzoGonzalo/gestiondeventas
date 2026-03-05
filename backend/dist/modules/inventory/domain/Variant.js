"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
class Variant {
    constructor(id, companyId, productId, nombre, sku, codigoBarras, atributos, unitType, precioCompra, precioVenta, stockActual, stockMinimo, ubicacion, activo, creadoPor, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.productId = productId;
        this.nombre = nombre;
        this.sku = sku;
        this.codigoBarras = codigoBarras;
        this.atributos = atributos;
        this.unitType = unitType;
        this.precioCompra = precioCompra;
        this.precioVenta = precioVenta;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.ubicacion = ubicacion;
        this.activo = activo;
        this.creadoPor = creadoPor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Variant = Variant;

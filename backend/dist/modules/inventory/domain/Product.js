"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id, companyId, categoryId, nombre, descripcion, imagen, activo, atributos, unitType, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.categoryId = categoryId;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.activo = activo;
        this.atributos = atributos;
        this.unitType = unitType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Product = Product;

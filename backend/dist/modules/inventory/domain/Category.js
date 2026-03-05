"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(id, companyId, nombre, descripcion, activo, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Category = Category;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
class Company {
    constructor(id, name, ruc, address, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.ruc = ruc;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Company = Company;

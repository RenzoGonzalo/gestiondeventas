"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, password, companyId, roles, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.companyId = companyId;
        this.roles = roles;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;

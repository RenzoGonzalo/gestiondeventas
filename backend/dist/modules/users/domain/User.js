"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, password, roleId, roleName, companyId, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.roleId = roleId;
        this.roleName = roleName;
        this.companyId = companyId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;

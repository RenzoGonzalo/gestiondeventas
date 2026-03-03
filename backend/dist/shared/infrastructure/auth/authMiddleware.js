"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireSuperAdmin = requireSuperAdmin;
exports.requireStoreAdmin = requireStoreAdmin;
exports.requireSameCompanyFromParam = requireSameCompanyFromParam;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
function requireSuperAdmin(req, res, next) {
    if (!req.user || req.user.roleName !== "SUPER_ADMIN") {
        return res
            .status(403)
            .json({ message: "No autorizado: requiere rol SUPER_ADMIN" });
    }
    next();
}
function requireStoreAdmin(req, res, next) {
    if (!req.user || req.user.roleName !== "STORE_ADMIN") {
        return res
            .status(403)
            .json({ message: "No autorizado: requiere rol STORE_ADMIN" });
    }
    next();
}
function requireSameCompanyFromParam(paramName) {
    return (req, res, next) => {
        const requestedCompanyId = req.params?.[paramName];
        if (!req.user) {
            return res.status(401).json({ message: "Token missing" });
        }
        if (!requestedCompanyId) {
            return res.status(400).json({ message: "CompanyId missing" });
        }
        if (!req.user.companyId) {
            return res.status(403).json({ message: "No autorizado: usuario sin companyId" });
        }
        if (req.user.companyId !== requestedCompanyId) {
            return res.status(403).json({ message: "No autorizado: empresa incorrecta" });
        }
        next();
    };
}

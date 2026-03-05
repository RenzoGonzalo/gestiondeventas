"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryConflictError = exports.InventoryNotFoundError = exports.InventoryBadRequestError = void 0;
const AppError_1 = require("../../../shared/application/errors/AppError");
class InventoryBadRequestError extends AppError_1.BadRequestError {
}
exports.InventoryBadRequestError = InventoryBadRequestError;
class InventoryNotFoundError extends AppError_1.NotFoundError {
}
exports.InventoryNotFoundError = InventoryNotFoundError;
class InventoryConflictError extends AppError_1.ConflictError {
}
exports.InventoryConflictError = InventoryConflictError;

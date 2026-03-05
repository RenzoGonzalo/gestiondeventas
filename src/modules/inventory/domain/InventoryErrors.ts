import { BadRequestError, ConflictError, NotFoundError } from "../../../shared/application/errors/AppError";

export class InventoryBadRequestError extends BadRequestError {}
export class InventoryNotFoundError extends NotFoundError {}
export class InventoryConflictError extends ConflictError {}

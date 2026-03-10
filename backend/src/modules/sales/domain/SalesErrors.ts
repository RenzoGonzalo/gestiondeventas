import { BadRequestError, NotFoundError, ConflictError, ForbiddenError } from "../../../shared/application/errors/AppError";

export class SalesBadRequestError extends BadRequestError {}
export class SalesNotFoundError extends NotFoundError {}
export class SalesConflictError extends ConflictError {}
export class SalesForbiddenError extends ForbiddenError {}

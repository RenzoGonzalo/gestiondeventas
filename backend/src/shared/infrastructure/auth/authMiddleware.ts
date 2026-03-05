import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

type JwtPayload = {
  id: string;
  email: string;
  companyId: string | null;
  roles: string[];
  iat?: number;
  exp?: number;
};

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    req.user = decoded as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !Array.isArray(req.user.roles) || !req.user.roles.includes("SUPER_ADMIN")) {
    return res
      .status(403)
      .json({ message: "No autorizado: requiere rol SUPER_ADMIN" });
  }

  next();
}

export function requireStoreAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !Array.isArray(req.user.roles) || !req.user.roles.includes("STORE_ADMIN")) {
    return res
      .status(403)
      .json({ message: "No autorizado: requiere rol STORE_ADMIN" });
  }

  next();
}

export function requireAnyRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const roles: unknown = req.user?.roles;

    if (!Array.isArray(roles)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const ok = allowedRoles.some((r) => roles.includes(r));
    if (!ok) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
}

export function requireSameCompanyFromParam(paramName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

type JwtPayload = {
  id: string;
  email: string;
  nombre: string;
  companyId: string | null;
  rol: string;
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

  const header = authHeader.trim();
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : header;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

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

type SellerLoginAttemptState = {
  failures: number;
  windowStartedAt: number;
  blockedUntil: number | null;
};

const sellerLoginAttempts = new Map<string, SellerLoginAttemptState>();
const SELLER_LOGIN_MAX_FAILURES = 5;
const SELLER_LOGIN_WINDOW_MS = 10 * 60 * 1000;
const SELLER_LOGIN_BLOCK_MS = 10 * 60 * 1000;

function getClientIp(req: Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
}

function getSellerLoginState(ip: string, now: number) {
  const current = sellerLoginAttempts.get(ip);

  if (!current) {
    const initial: SellerLoginAttemptState = {
      failures: 0,
      windowStartedAt: now,
      blockedUntil: null
    };
    sellerLoginAttempts.set(ip, initial);
    return initial;
  }

  if (current.blockedUntil && current.blockedUntil <= now) {
    current.blockedUntil = null;
    current.failures = 0;
    current.windowStartedAt = now;
  }

  if (now - current.windowStartedAt > SELLER_LOGIN_WINDOW_MS) {
    current.failures = 0;
    current.windowStartedAt = now;
  }

  return current;
}

export function sellerLoginRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const now = Date.now();
  const ip = getClientIp(req);
  const state = getSellerLoginState(ip, now);

  if (state.blockedUntil && state.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((state.blockedUntil - now) / 1000);
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      message: "Demasiados intentos. Intenta nuevamente en unos minutos."
    });
  }

  res.on("finish", () => {
    const finishedAt = Date.now();
    const latestState = getSellerLoginState(ip, finishedAt);

    if (res.statusCode === 200) {
      sellerLoginAttempts.delete(ip);
      return;
    }

    if (res.statusCode !== 401 && res.statusCode !== 403) {
      return;
    }

    latestState.failures += 1;

    if (latestState.failures >= SELLER_LOGIN_MAX_FAILURES) {
      latestState.blockedUntil = finishedAt + SELLER_LOGIN_BLOCK_MS;
    }
  });

  next();
}

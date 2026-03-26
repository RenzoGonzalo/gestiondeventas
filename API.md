# Backend – Documentación (JSDoc + APIs)

> Fecha: 2026-03-26

Este backend está hecho con **Node.js + Express + TypeScript + Prisma (PostgreSQL)**.

- Entry point: `src/app.ts`
- Autenticación: JWT en header `Authorization: Bearer <token>`
- ORM/DB: Prisma (`prisma/schema.prisma`)

---

## 1) Convenciones de autenticación

### Header
- Requerido en rutas protegidas:
  - `Authorization: Bearer <JWT>`

### Payload típico del JWT
El middleware (`src/shared/infrastructure/auth/authMiddleware.ts`) coloca en `req.user` un payload con forma aproximada:

```ts
type JwtPayload = {
  id: string;
  email: string;
  nombre: string;
  companyId: string | null;
  rol: string;     // rol primario
  roles: string[]; // todos los roles
  iat?: number;
  exp?: number;
};
```

### Roles
- `SUPER_ADMIN`
- `STORE_ADMIN`
- `SELLER`

Reglas aplicadas por middleware:
- `requireSuperAdmin`: requiere `roles.includes("SUPER_ADMIN")`
- `requireStoreAdmin`: requiere `roles.includes("STORE_ADMIN")`
- `requireAnyRole([..])`: al menos un rol permitido
- `requireSameCompanyFromParam("companyId")`: `req.user.companyId` debe coincidir con el param

---

## 2) Variables de entorno (ENV)

Definidas/esperadas en runtime (según código):

- `PORT` (default `4000`)
- `CORS_ORIGIN` (default `http://localhost:5173`) – lista separada por coma
- `DATABASE_URL` (Prisma/Postgres)
- `JWT_SECRET` (obligatorio para firmar/verificar JWT)

Google OAuth (login STORE_ADMIN):
- `GOOGLE_CLIENT_ID`

Email (Gmail SMTP via Nodemailer):
- `EMAIL_USER`
- `EMAIL_PASS` (App Password)

---

## 3) Rutas (APIs)

Base server: por defecto `http://localhost:4000`

### 3.1 Auth (`/api/auth`)
Router: `src/modules/users/presentation/authRouter.ts`

#### POST `/api/auth/login`
Login **email + password** (orientado a SUPER_ADMIN).

#### POST `/api/auth/seller-login`
Login de **SELLER por código** (PIN 4/6 dígitos) según implementación del caso de uso.

#### POST `/api/auth/google-login`
Login **STORE_ADMIN con Google** (`id_token`).

#### POST `/api/auth/resend-verification`
Reenvía verificación de email (SUPER_ADMIN).

#### GET `/api/auth/verify-email?token=...`
Verifica email por token.

Notas:
- Algunas rutas pueden rechazar si el email no está verificado (según casos de uso).

---

### 3.2 Sellers (Store Admin) (`/api/store-admin/sellers`)
Router: `src/modules/users/presentation/sellersRouter.ts`

Todas requieren:
- `authMiddleware`
- `requireStoreAdmin`

#### GET `/api/store-admin/sellers`
Lista sellers de la empresa.

> Seguridad: el listado está diseñado para **NO exponer** el código del seller.

#### POST `/api/store-admin/sellers`
Crea seller para la empresa.

---

### 3.3 Super Admin (`/api/super`)
Router: `src/modules/users/presentation/superRouter.ts`

Todas requieren:
- `authMiddleware`
- `requireSuperAdmin`

#### GET `/api/super/companies`
Lista empresas.

#### POST `/api/super/companies`
Provisiona empresa (y típicamente su admin) según el caso de uso.

#### PUT `/api/super/companies/:id`
Actualiza empresa.

---

### 3.4 Companies (`/companies`)
Router: `src/modules/companies/presentation/companyRouter.ts`

#### GET `/companies/me`
Requiere:
- `authMiddleware`
- `requireAnyRole(["STORE_ADMIN", "SELLER"])`

Devuelve empresa del usuario autenticado.

#### GET `/companies/:companyId`
Requiere:
- `authMiddleware`
- `requireStoreAdmin`
- `requireSameCompanyFromParam("companyId")`

Devuelve empresa por id (solo su propio companyId).

---

### 3.5 Inventory (`/api`)
Router: `src/modules/inventory/presentation/inventoryRouter.ts`

#### Categorías (`/api/categories`)
Requiere `STORE_ADMIN`.
- `POST /api/categories`
- `GET /api/categories`
- `GET /api/categories/:id`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

#### Productos (`/api/products`)
Requiere `STORE_ADMIN`.
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/variants` (agrega variante a producto)

#### Variantes (`/api/variants`)
Requiere `STORE_ADMIN`.
- `PUT /api/variants/:id`
- `DELETE /api/variants/:id`
- `POST /api/variants/:id/stock/adjust`

#### Seller inventory (`/api/seller`)
Requiere `STORE_ADMIN` o `SELLER`.
- `GET /api/seller/products`
- `GET /api/seller/products/search`

---

### 3.6 Sales (`/api/sales`)
Router: `src/modules/sales/presentation/salesRouter.ts`

#### POST `/api/sales`
Requiere `STORE_ADMIN` o `SELLER`.
Crea una venta.

#### GET `/api/sales/my`
Requiere `STORE_ADMIN` o `SELLER`.
Lista ventas “mías” (filtra por usuario en token).

#### GET `/api/sales`
Requiere `STORE_ADMIN`.
Lista ventas (MVP).

#### GET `/api/sales/:id`
Requiere `STORE_ADMIN`.
Obtiene venta.

#### POST `/api/sales/:id/cancel`
Requiere `STORE_ADMIN`.
Anula venta.

---

### 3.7 Reports (`/api/reports`)
Router: `src/modules/reports/presentation/reports.routes.ts`

Todos requieren:
- `authMiddleware`
- `requireStoreAdmin`

- `GET /api/reports/dashboard`
- `GET /api/reports/sales/daily`
- `GET /api/reports/products/top`
- `GET /api/reports/products/low-stock`
- `GET /api/reports/sellers/performance`

---

## 4) Modelo de datos (Prisma) – resumen

Archivo: `prisma/schema.prisma`

Entidades principales:
- `Company`
- `User` + `Role` + `UserRole`
- `Category`, `Product`, `Variant`
- `StockMovement`
- `Sale`, `SaleItem`

Campos clave de auth:
- `User.googleSub` (STORE_ADMIN)
- `User.sellerCode` (SELLER)
- `User.emailVerified` + token hash/expires (SUPER_ADMIN)
- `User.storeAdminWelcomeEmailSentAt` (idempotencia del correo bienvenida)

---

## 5) JSDoc: guía rápida para este repo

Recomendación mínima (sin cambiar arquitectura):

- **Casos de uso (application)**: documentar objetivo, entradas, salidas y errores.
- **Controllers/routers (presentation)**: documentar cada handler, auth requerida y ejemplos.
- **Repositorios (domain/infrastructure)**: documentar contrato y side-effects.

Ejemplo sugerido para un use case:

```ts
/**
 * Inicia sesión con Google para STORE_ADMIN.
 *
 * Reglas:
 * - Valida id_token contra GOOGLE_CLIENT_ID.
 * - Vincula por google_sub.
 * - Envía email de bienvenida solo la primera vez.
 *
 * @throws {AppError} Si el token es inválido o el usuario no cumple reglas.
 */
export class LoginWithGoogleUseCase { /* ... */ }
```

---

## 6) Ejemplos de uso (curl)

### Login (email/password)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"secret"}'
```

### Usar token
```bash
curl http://localhost:4000/api/reports/dashboard \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 7) Pendientes típicos (opcionales)

- Si quieren documentación autogenerada estilo Swagger/OpenAPI:
  - Se puede agregar `swagger-jsdoc` + `swagger-ui-express` leyendo JSDoc.
  - No lo instalé aquí para mantener cambios mínimos.

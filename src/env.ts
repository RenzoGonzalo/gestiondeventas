import "dotenv/config";

function getTrimmedEnv(name: string): string {
  return String(process.env[name] ?? "").trim();
}

const databaseUrl = getTrimmedEnv("DATABASE_URL");
const directUrl = getTrimmedEnv("DIRECT_URL");

// Prisma `directUrl` is optional in concept, but if it's set in `schema.prisma`
// it must exist at runtime/CLI. We default it to DATABASE_URL to keep local/dev simple.
if (databaseUrl && !directUrl) {
  process.env.DIRECT_URL = databaseUrl;
}

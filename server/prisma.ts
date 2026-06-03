import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

import { config } from "./config";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPoolConfig(): PoolConfig {
  const isCleverCloud = config.db.url.includes("services.clever-cloud.com");

  if (!isCleverCloud) {
    return { connectionString: config.db.url };
  }

  const connectionUrl = new URL(config.db.url);
  connectionUrl.searchParams.delete("schema");
  connectionUrl.searchParams.delete("sslmode");

  return {
    connectionString: connectionUrl.toString(),
    ssl: { rejectUnauthorized: false },
  };
}

const poolConfig: PoolConfig = {
  ...createPoolConfig(),
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(poolConfig, { schema: config.db.schema }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

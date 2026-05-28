import "dotenv/config";
import { defineConfig } from "prisma/config";
import { config } from "./server/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: config.db.url,
  },
});

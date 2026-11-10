import { defineConfig } from "prisma/config";
import { configDotenv } from "dotenv";

configDotenv()

const databaseUrl = process.env.DATABASE_URL;

console.log(databaseUrl);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
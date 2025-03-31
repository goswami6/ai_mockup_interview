import { defineConfig } from "drizzle-kit";
export default defineConfig({
//   out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
//   driver: "pglite",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_e0Or2fZaGluD@ep-white-wind-a547as46-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
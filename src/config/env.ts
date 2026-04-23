import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST"
];

const missingVars = requiredEnvVars.filter(
  (key) => !process.env[key] || process.env[key]?.trim() === ""
);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:");
  missingVars.forEach((v) => console.error(`   - ${v}`));

  process.exit(1); 
}

export const env = {
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_HOST: process.env.DB_HOST!,
  PORT: process.env.PORT || "3000"
};
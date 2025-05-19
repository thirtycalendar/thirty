import "dotenv/config";

export const NODE_ENV = process.env.NODE_ENV!;

// Auth
export const GOOGLE_CLIENT_PROD_ID = process.env.GOOGLE_CLIENT_PROD_ID!;
export const GOOGLE_CLIENT_PROD_SECRET = process.env.GOOGLE_CLIENT_PROD_SECRET!;

export const GOOGLE_CLIENT_DEV_ID = process.env.GOOGLE_CLIENT_DEV_ID!;
export const GOOGLE_CLIENT_DEV_SECRET = process.env.GOOGLE_CLIENT_DEV_SECRET!;

// Databases
export const DB_URL_PROD = process.env.DB_URL_PROD!;
export const DB_URL_DEV = process.env.DB_URL_DEV!;

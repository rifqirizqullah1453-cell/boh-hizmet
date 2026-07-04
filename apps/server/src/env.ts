import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  appSecret: required("APP_SECRET"),
  // Firebase Admin SDK credentials — see apps/server/.env.example.
  // Generate via Firebase Console > Project Settings > Service Accounts > Generate new private key.
  firebaseProjectId: required("FIREBASE_PROJECT_ID"),
  firebaseClientEmail: required("FIREBASE_CLIENT_EMAIL"),
  firebasePrivateKey: required("FIREBASE_PRIVATE_KEY"),
};

import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  "libsql://gdgsvec-vinaysiddha.aws-ap-south-1.turso.io";

const authToken =
  process.env.TURSO_AUTH_TOKEN ||
  "";

export const turso = createClient({
  url,
  authToken,
});


export default turso;

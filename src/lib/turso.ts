import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  "libsql://gdgsvec-vinaysiddha.aws-ap-south-1.turso.io";

const authToken =
  process.env.TURSO_AUTH_TOKEN ||
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mzk5NTksImlkIjoiMDFhMTFiZWItNzkwMS03NWJkLWFiZDUtYTJmM2MxOGQ5NmViIiwia2lkIjoiSGpEZF9XaGFuZHlpREhIV2I0M2ZrRWxmR1pMVG5IZWFUS0dNX3hUNW92dyIsInJpZCI6IjFkNzA0MGM2LTQwMTAtNGRiNy05ZDYxLTVjMTNhMThjZDJiZiJ9.-hKVZ2-AzTAlz6n6X3VoN5xmGkyL0oE6SLwUG9bHZYVetRiI46eSKQQOKrjkUbA_8UxAbItzzMHsbIZFyUk4Bg";

export const turso = createClient({
  url,
  authToken,
});

export default turso;

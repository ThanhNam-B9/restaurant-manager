import { z } from "zod";

const configSchemas = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
});

const configProjects = configSchemas.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!configProjects.success) {
  console.error("Failed to parse configuration:", configProjects.error);
  throw new Error("Invalid declared environment variables");
}

const evnClientConfig = configProjects.data;
export default evnClientConfig;
// Chia client vớ server ra config riêng

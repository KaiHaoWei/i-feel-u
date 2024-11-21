import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  OPENAI_API_KEY_1: z.string(),
  OPENAI_API_KEY_2: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  OPENAI_API_KEY_1: process.env.OPENAI_API_KEY_1!,
  OPENAI_API_KEY_2: process.env.OPENAI_API_KEY_2!,
};

privateEnvSchema.parse(privateEnv);

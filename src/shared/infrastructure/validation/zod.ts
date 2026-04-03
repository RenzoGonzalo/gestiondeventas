import { z } from "zod";

export function validateBody<T>(schema: z.ZodType<T>, body: unknown): T {
  return schema.parse(body);
}

export function validateParams<T>(schema: z.ZodType<T>, params: unknown): T {
  return schema.parse(params);
}

export function validateQuery<T>(schema: z.ZodType<T>, query: unknown): T {
  return schema.parse(query);
}

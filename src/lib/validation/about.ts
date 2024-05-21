import { z } from "zod";

export const createAboutSchema = z.object({
  content: z.string().min(1, {
    message: "Content is required and must be at least 1 character.",
  }),
});

export type CreateAboutSchema = z.infer<typeof createAboutSchema>;

export const updateAboutSchema = createAboutSchema.extend({
  id: z.string().min(1),
});

export const deleteAboutSchema = z.object({
  id: z.string().min(1),
});

import { z } from "zod";

export const createMemoSchema = z.object({
  title: z.string().min(3, {
    message: "Title is required and must be at least 3 characters.",
  }),
  content: z
    .string()
    .max(300, {
      message: "I'm sorry, but memos cannot exceed 300 characters.",
    })
    .optional(),
});

export type CreateMemoSchema = z.infer<typeof createMemoSchema>;

export const updateMemoSchema = createMemoSchema.extend({
  id: z.string().min(1),
});

export const deleteMemoSchema = z.object({
  id: z.string().min(1),
});

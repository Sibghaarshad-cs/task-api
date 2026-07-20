const { z } = require("zod");

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  completed: z.boolean().optional(),
});

module.exports = taskSchema;
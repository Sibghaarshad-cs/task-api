const { z } = require("zod");

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
  userId: z.number(),
});

module.exports = taskSchema;
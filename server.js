const taskSchema = require("./validators/taskValidator");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// GET - Return all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// GET - Return a single task
app.get("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
});

// POST - Create a task
app.post("/tasks", async (req, res) => {
  try {
    const result = taskSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({
    errors: result.error.issues,
  });
}

const { title, completed } = result.data;

    const task = await prisma.task.create({
      data: {
        title,
        completed: completed ?? false,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

// PUT - Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = taskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues,
      });
    }

    const { title, completed } = result.data;

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? existingTask.title,
        completed: completed ?? existingTask.completed,
      },
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
    });
  }
});
// DELETE - Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON from request body
app.use(express.json());

// Fake database
let tasks = [
  {
    id: 1,
    title: "Learn Express",
    completed: false,
  },
  {
    id: 2,
    title: "Build Task API",
    completed: false,
  },
];

// GET - Return all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET - Return a single task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(200).json(task);
});

// POST - Create a new task
app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: completed ?? false,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task created successfully",
    task: newTask,
  });
});

// PUT - Update a task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.status(200).json({
    message: "Task updated successfully",
    task,
  });
});

// DELETE - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
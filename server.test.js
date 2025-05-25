const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Setup in-memory app for testing
const app = express();
app.use(express.json());
app.use(cors());

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);

app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task({ title: req.body.title });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { title: { $regex: q, $options: "i" } } : {};
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test setup
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/todo_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
afterEach(async () => {
  await Task.deleteMany();
});

describe("TODO API", () => {
  it("should add a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Task" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("should delete a task", async () => {
    const task = await Task.create({ title: "To Delete" });
    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(204);
  });

  it("should search tasks", async () => {
    await Task.create({ title: "Find Me" });
    const res = await request(app).get("/api/tasks?q=Find");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toContain("Find");
  });
});

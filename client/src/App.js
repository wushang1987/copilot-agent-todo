import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");

  const fetchTasks = async (q = "") => {
    const res = await axios.get(
      `/api/tasks${q ? `?q=${encodeURIComponent(q)}` : ""}`
    );
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await axios.post("/api/tasks", { title: newTask });
    setNewTask("");
    fetchTasks(search);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    fetchTasks(search);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTasks(e.target.value);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        TODO List
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Add Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <TextField
        label="Search"
        value={search}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(task._id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;

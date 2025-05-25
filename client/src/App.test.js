import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios");

describe("TODO App", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({ data: { title: "Test Task", _id: "1" } });
    axios.delete.mockResolvedValue({});
  });

  it("renders the app and adds a task", async () => {
    render(<App />);
    const input = screen.getByLabelText(/add task/i);
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/api/tasks", {
        title: "Test Task",
      })
    );
  });

  it("searches tasks", async () => {
    render(<App />);
    const search = screen.getByLabelText(/search/i);
    fireEvent.change(search, { target: { value: "Find" } });
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("/api/tasks?q=Find")
    );
  });

  it("deletes a task", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ _id: "1", title: "Task to Delete" }],
    });
    render(<App />);
    await waitFor(() => screen.getByText("Task to Delete"));
    fireEvent.click(screen.getByLabelText("delete"));
    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith("/api/tasks/1")
    );
  });
});

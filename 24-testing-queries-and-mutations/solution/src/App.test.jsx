import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";
import { renderWithClient } from "./testUtils";
import * as api from "./api";

vi.mock("./api", () => ({
  fetchTodos: vi.fn(async () => [
    { id: 1, text: "Mock Todo A" },
    { id: 2, text: "Mock Todo B" },
  ]),
  addTodo: vi.fn(async (text) => ({ id: 3, text })),
}));

test("renders initial todos from query", async () => {
  renderWithClient(<App />);

  expect(await screen.findByText("Mock Todo A")).toBeInTheDocument();
  expect(await screen.findByText("Mock Todo B")).toBeInTheDocument();
});

test("adds a new todo with mutation", async () => {
  const user = userEvent.setup();
  renderWithClient(<App />);

  await screen.findByText("Mock Todo A");
  await user.type(screen.getByLabelText("todo-input"), "New test todo");
  await user.click(screen.getByRole("button", { name: /add todo/i }));

  expect(api.addTodo).toHaveBeenCalled();
  expect(api.addTodo.mock.calls[0][0]).toBe("New test todo");
});

test("shows error message on mutation failure", async () => {
  api.addTodo.mockRejectedValueOnce(new Error("Mutation exploded"));
  const user = userEvent.setup();
  renderWithClient(<App />);

  await screen.findByText("Mock Todo A");
  await user.type(screen.getByLabelText("todo-input"), "broken");
  await user.click(screen.getByRole("button", { name: /add todo/i }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Mutation exploded");
});

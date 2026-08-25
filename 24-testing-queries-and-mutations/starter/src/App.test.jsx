import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";
import { renderWithClient } from "./testUtils";

vi.mock("./api", () => ({
  fetchTodos: vi.fn(async () => [
    { id: 1, text: "Mock Todo A" },
    { id: 2, text: "Mock Todo B" },
  ]),
  addTodo: vi.fn(async (text) => ({ id: 3, text })),
}));

test("TODO: renders initial todos from query", async () => {
  expect.hasAssertions();
  renderWithClient(<App />);
  // TODO: add assertions for loaded todo items
});

test("TODO: adds a new todo with mutation", async () => {
  expect.hasAssertions();
  const user = userEvent.setup();
  renderWithClient(<App />);
  // TODO: type text, submit, assert new item appears
  await user.click(screen.getByRole("button", { name: /add todo/i }));
});

test("TODO: shows error message on mutation failure", async () => {
  expect.hasAssertions();
  // TODO: override addTodo mock for this test to reject and assert alert text
});

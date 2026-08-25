const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let todos = [
  { id: 1, text: "Watch for paused fetch state", done: false },
  { id: 2, text: "Add optimistic updates", done: false },
  { id: 3, text: "Guard overlapping invalidations", done: false },
];

export async function fetchTodos() {
  await wait(2000);
  return [...todos];
}

export async function toggleTodo(todoId) {
  await wait(2000);
  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, done: !todo.done } : todo
  );
  return todos.find((todo) => todo.id === todoId);
}

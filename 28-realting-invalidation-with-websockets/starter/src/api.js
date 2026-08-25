const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let todos = [
  { id: 1, text: "Read message event", done: false },
  { id: 2, text: "Invalidate todos query", done: false },
];

export async function fetchTodos() {
  await wait(150);
  return [...todos];
}

export async function toggleTodo(id) {
  await wait(120);
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  return todos;
}

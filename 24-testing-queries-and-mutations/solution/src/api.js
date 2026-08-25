const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let todos = [
  { id: 1, text: "Write query tests" },
  { id: 2, text: "Write mutation tests" },
];

export async function fetchTodos() {
  await wait(100);
  return [...todos];
}

export async function addTodo(text) {
  await wait(100);
  if (!text.trim()) {
    throw new Error("Todo text is required");
  }
  const next = { id: Date.now(), text };
  todos = [...todos, next];
  return next;
}

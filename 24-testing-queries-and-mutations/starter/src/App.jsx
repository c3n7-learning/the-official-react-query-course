import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addTodo, fetchTodos } from "./api";

export default function App() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <main>
      <h1>Testing Queries and Mutations</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addTodoMutation.mutate(text);
          setText("");
        }}
      >
        <input
          aria-label="todo-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      {todosQuery.isPending ? <p>Loading...</p> : null}
      {addTodoMutation.isError ? <p role="alert">{addTodoMutation.error.message}</p> : null}
      <ul>
        {todosQuery.data?.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  );
}

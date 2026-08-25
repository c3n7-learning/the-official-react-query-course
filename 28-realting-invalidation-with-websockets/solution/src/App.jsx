import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "./api";
import useWebsocketQueryInvalidate from "./useWebsocketQueryInvalidate";

function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: Infinity,
  });
}

function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const socket = new WebSocket("ws://localhost:3031");
      socket.addEventListener("open", () => {
        socket.send(JSON.stringify({ type: "toggle", id }));
        socket.close();
      });
      return toggleTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export default function App() {
  const todosQuery = useTodos();
  const toggleMutation = useToggleTodo();
  useWebsocketQueryInvalidate();

  if (todosQuery.isPending) return <p>Loading todos...</p>;

  return (
    <main>
      <h1>Realtime Invalidation with WebSockets</h1>
      <ul>
        {todosQuery.data.map((todo) => (
          <li key={todo.id}>
            <button onClick={() => toggleMutation.mutate(todo.id)}>
              {todo.done ? "[x]" : "[ ]"} {todo.text}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "./api";

function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 30_000,
    networkMode: "offlineFirst",
  });
}

function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["todos", "toggle"],
    mutationFn: toggleTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);

      queryClient.setQueryData(["todos"], (old = []) =>
        old.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: ["todos", "toggle"] }) === 1) {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
  });
}

export default function App() {
  const todosQuery = useTodos();
  const toggleMutation = useToggleTodo();

  if (todosQuery.isPending) return <p className="status">Loading todos...</p>;
  if (todosQuery.isError) return <p className="status">Error loading todos.</p>;

  return (
    <main className="page">
      <h1>Offline Todos</h1>
      {todosQuery.fetchStatus === "paused" ? (
        <p className="badge offline">Offline mode: using cached data</p>
      ) : null}
      <ul className="list">
        {todosQuery.data.map((todo) => (
          <li key={todo.id}>
            <button
              disabled={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate(todo.id)}
              className={todo.done ? "done" : ""}
            >
              {todo.done ? "[x]" : "[ ]"} {todo.text}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

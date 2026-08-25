import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "./api";

function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 30_000,
    // TODO 1: add networkMode to improve offline behavior
  });
}

function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["todos", "toggle"],
    mutationFn: toggleTodo,
    // TODO 2: add optimistic update with onMutate + rollback on onError
    onSettled: () => {
      // TODO 3: avoid duplicate invalidations during overlapping mutations
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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
      {/* TODO 4: render an offline indicator when fetchStatus is paused */}
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

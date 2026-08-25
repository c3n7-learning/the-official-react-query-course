import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "./api";

function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 5_000,
    // TODO 1: add networkMode to improve offline behavior
    networkMode: "offlineFirst",
  });
}

function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["todos", "toggle"],
    mutationFn: toggleTodo,
    // TODO 2: add optimistic update with onMutate + rollback on onError
    onMutate: async (todoId) => {
      // cancel any ongoing queries first
      await queryClient.cancelQueries("todos");

      // Take snapshots
      const snapshot = queryClient.getQueryData(['todos']);

      // optimistically update the cache
      queryClient.setQueryData(
        ["todos"],
        (previous) => {
          if (!previous) {
            return undefined;
          }

          return previous.map((todo) => todo.id != todoId ? todo : ({ ...todo, done: !todo.done }))
        });

      // Now return a rollback function in case things go south 
      return () => {
        if (snapshot) {
          queryClient.setQueryData(['todos'], snapshot);
        }
      }
    },
    onError: (_, __, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      // TODO 3: avoid duplicate invalidations during overlapping mutations
      // We want to ensure the mutation runnings are only one (for this key).
      // This means that all other mutations in the queue were processed, and we are on the latest one
      if (queryClient.isMutating({ mutationKey: ['todos', 'toggle'] }) == 1) {
        console.log("Invalidating", { 'id': crypto.randomUUID() })
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      } else {
        console.log("Skipping", { 'id': crypto.randomUUID() })
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
      <h1>Offline Todos </h1>
      {/* TODO 4: render an offline indicator when fetchStatus is paused */}
      {todosQuery.isPaused ? (<p className="status">Offline</p>) : <></>}
      <ul className="list">
        {todosQuery.data.map((todo) => (
          <li key={todo.id}>
            <button
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

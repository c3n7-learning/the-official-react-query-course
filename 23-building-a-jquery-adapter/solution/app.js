import { QueryClient, QueryObserver } from "https://esm.sh/@tanstack/query-core@5";

const queryClient = new QueryClient();

async function fetchRepo() {
  const response = await fetch("https://api.github.com/repos/TanStack/query");
  if (!response.ok) {
    throw new Error("Failed to fetch repo");
  }
  return response.json();
}

$.widget("custom.useQuery", {
  _create() {
    this.options.queryClient.mount();
    this._observer = new QueryObserver(
      this.options.queryClient,
      this.options.queryOptions
    );
    this._unsubscribe = this._observer.subscribe(() => {
      const result = this._observer.getCurrentResult();
      this._trigger("update", null, this._observer.trackResult(result));
    });
  },
  _setOption(key, value) {
    this._super(key, value);
    if (key === "queryOptions") {
      this._observer.setOptions(value);
    }
  },
  _destroy() {
    this.options.queryClient.unmount();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  },
});

$(document).ready(() => {
  $("#app").useQuery({
    queryClient,
    queryOptions: {
      queryKey: ["repoData"],
      queryFn: fetchRepo,
      staleTime: 10_000,
    },
    update: (_event, result) => {
      if (result.status === "pending") {
        $("#app").text("Loading...");
      } else if (result.status === "error") {
        $("#app").text(`Error: ${result.error.message}`);
      } else {
        $("#app").text(`${result.data.name}: ${result.data.description}`);
      }
    },
  });
});

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
  // constructor
  _create() {
    // TODO 1: call this.options.queryClient.mount()
    this.options.queryClient.mount() // to subscribe to browser events that fire refetch on browser focus

    // TODO 2: create QueryObserver with queryClient + queryOptions
    this._observer = new QueryObserver(
      this.options.queryClient,
      this.options.queryOptions,
    );

    // TODO 3: subscribe and call this._trigger("update", null, trackedResult)
    this.unsubscribe = this._observer.subscribe(() => {
      const result = this._observer.getCurrentResult();
      const trackedResult = this._observer.trackResult(result); // We want to trigger rerenders only if the properties a component cares about changes
      console.log("Subscribing", { result, trackedResult });
      this._trigger(
        'update',
        null,
        trackedResult,
      );
    });
  },
  _setOption(key, value) {
    this._super(key, value);
    // TODO 4: if queryOptions changed, call observer.setOptions
    // give the consumer an ability to modify options
    if (key === "queryOptions") {
      console.log("Modifying options", value);
      this._observer.setOptions(value);
    }
  },
  _destroy() {
    // TODO 5: unsubscribe and unmount queryClient
    this.options.queryClient.unmount()
    this.unsubscribe();
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

export async function fetchRepoData() {
  const response = await fetch("https://api.github.com/repos/TanStack/query", {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch repo");
  }
  return response.json();
}

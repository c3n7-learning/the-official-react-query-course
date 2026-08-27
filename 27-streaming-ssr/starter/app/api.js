const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchRepoData() {
  await wait(2_000);

  const response = await fetch("https://api.github.com/repos/TanStack/query", {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error("Failed to fetch repo");
  return response.json();
}

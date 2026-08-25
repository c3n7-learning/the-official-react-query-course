export async function fetchRepoList(sort = "stars") {
  const response = await fetch(
    `https://api.github.com/orgs/TanStack/repos?per_page=10&sort=${sort}`
  );
  if (!response.ok) throw new Error("Failed to fetch repos");
  return response.json();
}

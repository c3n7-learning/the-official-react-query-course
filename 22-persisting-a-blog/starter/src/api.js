const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const POSTS = [
  {
    id: 1,
    title: "Why Query Keys Matter",
    body: "Use stable query keys to prevent accidental cache misses.",
  },
  {
    id: 2,
    title: "A Gentle Intro to Suspense",
    body: "Suspense removes manual loading branches for data dependencies.",
  },
  {
    id: 3,
    title: "Persisting Client State",
    body: "Persisting query caches can make reload UX feel instant.",
  },
];

export async function fetchPostList() {
  await wait(350);
  return POSTS.map(({ id, title }) => ({ id, title }));
}

export async function fetchPostById(id) {
  await wait(400);
  return POSTS.find((post) => post.id === Number(id));
}

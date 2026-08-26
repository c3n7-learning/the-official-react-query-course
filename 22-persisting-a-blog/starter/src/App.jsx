import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById, fetchPostList } from "./api";

function usePostList() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPostList,
    meta: {
      persist: true,
    }
  });
}

function usePost(postId) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostById(postId),
    enabled: Boolean(postId),
    // TODO: add per-query persister once app-level persistence works
  });
}

export default function App() {
  const [postId, setPostId] = useState(1);
  const postListQuery = usePostList();
  const postQuery = usePost(postId);

  const selected = useMemo(
    () => postListQuery.data?.find((post) => post.id === postId),
    [postListQuery.data, postId]
  );

  return (
    <main className="page">
      <h1>Persisting a Blog</h1>
      <div className="grid">
        <section>
          <h2>Posts</h2>
          {postListQuery.isPending ? <p>Loading...</p> : null}
          <ul>
            {postListQuery.data?.map((post) => (
              <li key={post.id}>
                <button onClick={() => setPostId(post.id)}>{post.title}</button>
              </li>
            ))}
          </ul>
        </section>
        <article>
          <h2>{selected?.title ?? "Post"}</h2>
          {postQuery.isPending ? <p>Loading post...</p> : null}
          <p>{postQuery.data?.body}</p>
        </article>
      </div>
    </main>
  );
}

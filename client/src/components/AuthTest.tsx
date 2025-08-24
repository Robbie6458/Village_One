import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthTest() {
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserId(session?.user?.id ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }
  async function signInGitHub() {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  }
  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createPost() {
    if (!userId || !title.trim()) return;
    const { error } = await supabase.from("posts").insert({
      author_id: userId,
      title,
      body: "Hello from Supabase!"
    });
    if (error) alert(error.message);
    setTitle("");
  }

  return (
    <div style={{ padding: 16, border: "1px solid #2a2a2a", borderRadius: 12 }}>
      <h3>Auth & Posts Test</h3>

      {userId ? (
        <>
          <p>Signed in as: <code>{userId}</code></p>
          <button onClick={signOut}>Sign out</button>
          <div style={{ marginTop: 12 }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title"
            />
            <button onClick={createPost}>Create post</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={signInGoogle}>Sign in with Google</button>
          <button onClick={signInGitHub} style={{ marginLeft: 8 }}>Sign in with GitHub</button>
        </>
      )}

      <PostsList />
    </div>
  );
}

function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  async function load() {
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,created_at,author_id")
      .order("created_at", { ascending: false });
    if (!error) setPosts(data ?? []);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        () => load()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Recent Posts</h4>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong>{" "}
            <small>by {p.author_id.slice(0, 8)}…</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

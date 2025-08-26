import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
export default function AuthTest() {
    const [userId, setUserId] = useState(null);
    const [title, setTitle] = useState("");
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null));
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
        if (!userId || !title.trim())
            return;
        const { error } = await supabase.from("posts").insert({
            author_id: userId,
            title,
            body: "Hello from Supabase!"
        });
        if (error)
            alert(error.message);
        setTitle("");
    }
    return (_jsxs("div", { style: { padding: 16, border: "1px solid #2a2a2a", borderRadius: 12 }, children: [_jsx("h3", { children: "Auth & Posts Test" }), userId ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: ["Signed in as: ", _jsx("code", { children: userId })] }), _jsx("button", { onClick: signOut, children: "Sign out" }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("input", { value: title, onChange: e => setTitle(e.target.value), placeholder: "Post title" }), _jsx("button", { onClick: createPost, children: "Create post" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: signInGoogle, children: "Sign in with Google" }), _jsx("button", { onClick: signInGitHub, style: { marginLeft: 8 }, children: "Sign in with GitHub" })] })), _jsx(PostsList, {})] }));
}
function PostsList() {
    const [posts, setPosts] = useState([]);
    async function load() {
        const { data, error } = await supabase
            .from("posts")
            .select("id,title,created_at,author_id")
            .order("created_at", { ascending: false });
        if (!error)
            setPosts(data ?? []);
    }
    useEffect(() => {
        load();
        const channel = supabase
            .channel("realtime:posts")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, () => load())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);
    return (_jsxs("div", { style: { marginTop: 16 }, children: [_jsx("h4", { children: "Recent Posts" }), _jsx("ul", { children: posts.map(p => (_jsxs("li", { children: [_jsx("strong", { children: p.title }), " ", _jsxs("small", { children: ["by ", p.author_id.slice(0, 8), "\u2026"] })] }, p.id))) })] }));
}

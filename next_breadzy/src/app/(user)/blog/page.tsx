"use client";
import * as React from "react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    title: "",
    content: "",
    tags: "",
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);

  async function fetchBlogs() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/blog/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: form.tags.split(",") }),
      });
    } else {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: form.tags.split(",") }),
      });
    }
    setForm({ title: "", content: "", tags: "" });
    setEditingId(null);
    fetchBlogs();
  }

  function handleEdit(blog: Blog) {
    setForm({
      title: blog.title,
      content: blog.content,
      tags: blog.tags.join(","),
    });
    setEditingId(blog._id);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    fetchBlogs();
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-2 border p-4 rounded">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Content"
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"} Blog
        </button>
        {editingId && (
          <button type="button" className="ml-2 text-sm text-gray-500" onClick={() => { setEditingId(null); setForm({ title: "", content: "", tags: "" }); }}>
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-8">
        {!loading && blogs.length === 0 && <div>Không thấy blog.</div>}
        {blogs.map((post) => (
          <article key={post._id} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 300) + (post.content.length > 300 ? '...' : '') }} />
            <div className="mt-2 text-xs text-gray-400">Tags: {post.tags?.join(', ')}</div>
            <div className="mt-2 flex gap-2">
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

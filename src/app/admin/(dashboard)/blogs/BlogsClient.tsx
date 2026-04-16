"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const defaultForm = { title: "", category: "", excerpt: "", content: "", readingTime: "", coverImage: "", isPinned: false, isPublished: false };
  const [formData, setFormData] = useState(defaultForm);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    if (res.ok) setBlogs(await res.json());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await adminMutation(`/api/blogs/${isEditing}`, { method: "PUT", body: formData });
    } else {
      await adminMutation("/api/blogs", { method: "POST", body: formData });
    }
    setFormData(defaultForm);
    setIsEditing(null);
    fetchBlogs();
  };

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    await adminMutation(`/api/blogs/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const handleTogglePin = async (item: any) => {
    await adminMutation(`/api/blogs/${item.id}`, {
      method: "PUT", 
      body: { isPinned: !item.isPinned },
    });
    fetchBlogs();
  };

  const handleTogglePublish = async (item: any) => {
    await adminMutation(`/api/blogs/${item.id}`, {
      method: "PUT", 
      body: { isPublished: !item.isPublished },
    });
    fetchBlogs();
  };

  return (
    <div>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>{isEditing ? "Edit Blog" : "Add New Blog"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" required style={inputStyle} />
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category / Tag" required style={inputStyle} />
          </div>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Short Excerpt" required style={{...inputStyle, resize: "vertical", minHeight: "60px"}} />
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (Markdown or Text)" required style={{...inputStyle, resize: "vertical", minHeight: "150px"}} />
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="text" name="readingTime" value={formData.readingTime} onChange={handleChange} placeholder="Reading Time (e.g. 5 min read)" required style={inputStyle} />
            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="Cover Image URL (optional)" style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem", cursor: "pointer" }}>
              <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleChange} />
              Pin to Homepage (Max 3)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem", cursor: "pointer" }}>
              <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
              Publish (Visible to public)
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary">{isEditing ? "Update Blog" : "Create Blog"}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(null); setFormData(defaultForm); }} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ padding: "0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Title</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Status</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Pinned</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No blogs found. Create one above.</td></tr>
            )}
            {blogs.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "500" }}>{item.title} <br/><span style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400"}}>{item.category}</span> {item.isPinned && <span style={{fontSize:"0.75rem", padding:"2px 8px", background:"var(--accent)", color:"black", borderRadius:"12px", marginLeft:"8px"}}>PINNED</span>}</td>
                <td style={{ padding: "16px 24px" }}>
                  <button onClick={() => handleTogglePublish(item)} style={{ color: item.isPublished ? "#22c55e" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                    {item.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <button onClick={() => handleTogglePin(item)} style={{ color: item.isPinned ? "var(--accent)" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline" }}>
                    {item.isPinned ? "Unpin" : "Pin"}
                  </button>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
                  <button onClick={() => handleEdit(item)} style={{ color: "#3b82f6", fontSize: "0.9rem", marginTop: "12px" }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "12px" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: "1 1 calc(50% - 8px)",
  padding: "12px",
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  color: "var(--foreground)",
  borderRadius: "8px",
  fontFamily: "var(--font-sans)",
  outline: "none"
};

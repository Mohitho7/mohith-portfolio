"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";

export default function AboutForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminMutation("/api/about", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setMessage("About section updated successfully.");
        router.refresh();
      } else {
        setMessage("Failed to update About section.");
      }
    } catch (err) {
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {message && <div style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", color: "var(--accent)"}}>{message}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>About Me (Your Story)</label>
        <textarea 
          name="content" 
          value={formData.content} 
          onChange={handleChange} 
          rows={8}
          style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px", fontFamily: "var(--font-sans)", resize: "vertical" }} 
          required 
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Profile Image URL (Optional)</label>
        <input 
          type="text" 
          name="imageUrl" 
          value={formData.imageUrl} 
          onChange={handleChange} 
          style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

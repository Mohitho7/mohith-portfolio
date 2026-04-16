"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";

export default function ContactForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    linkedin: initialData?.linkedin || "",
    github: initialData?.github || "",
    twitter: initialData?.twitter || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminMutation("/api/contact", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setMessage("Contact info updated successfully.");
        router.refresh();
      } else {
        setMessage("Failed to update Contact info.");
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

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
            required 
          />
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>LinkedIn URL</label>
          <input 
            type="url" 
            name="linkedin" 
            value={formData.linkedin} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
            required 
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>GitHub URL</label>
          <input 
            type="url" 
            name="github" 
            value={formData.github} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
            required 
          />
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Twitter/X URL (Optional)</label>
          <input 
            type="url" 
            name="twitter" 
            value={formData.twitter} 
            onChange={handleChange} 
            style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--glass-border)", color: "var(--foreground)", borderRadius: "8px" }} 
          />
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminMutation } from "@/lib/admin-fetch";

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const defaultForm = { title: "", description: "", techStack: "", outcome: "", demoLink: "", githubLink: "", imageUrl: "", isPinned: false };
  const [formData, setFormData] = useState(defaultForm);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await adminMutation(`/api/projects/${isEditing}`, { method: "PUT", body: formData });
    } else {
      await adminMutation("/api/projects", { method: "POST", body: formData });
    }
    setFormData(defaultForm);
    setIsEditing(null);
    fetchProjects();
  };

  const handleEdit = (proj: any) => {
    setIsEditing(proj.id);
    setFormData(proj);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await adminMutation(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleTogglePin = async (proj: any) => {
    await adminMutation(`/api/projects/${proj.id}`, {
      method: "PUT", 
      body: { isPinned: !proj.isPinned },
    });
    fetchProjects();
  };

  return (
    <div>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>{isEditing ? "Edit Project" : "Add New Project"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" required style={inputStyle} />
            <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="Tech Stack (e.g. Next.js, MongoDB, CSS)" required style={inputStyle} />
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project Description" required style={{...inputStyle, resize: "vertical", minHeight: "80px"}} />
          <textarea name="outcome" value={formData.outcome} onChange={handleChange} placeholder="Outcome / Impact" required style={{...inputStyle, resize: "vertical", minHeight: "60px"}} />
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="url" name="demoLink" value={formData.demoLink} onChange={handleChange} placeholder="Demo URL (optional)" style={inputStyle} />
            <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="GitHub URL (optional)" style={inputStyle} />
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image Cover URL (optional)" style={inputStyle} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem", cursor: "pointer" }}>
            <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleChange} />
            Pin to Homepage (Max 3 recommended)
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary">{isEditing ? "Update Project" : "Create Project"}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(null); setFormData(defaultForm); }} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ padding: "0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Title</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Tech</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Pinned</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No projects found. Create one above.</td></tr>
            )}
            {projects.map((proj) => (
              <tr key={proj.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "500" }}>{proj.title} {proj.isPinned && <span style={{fontSize:"0.75rem", padding:"2px 8px", background:"var(--accent)", color:"black", borderRadius:"12px", marginLeft:"8px"}}>PINNED</span>}</td>
                <td style={{ padding: "16px 24px", color: "var(--text-muted)", fontSize: "0.9rem" }}>{proj.techStack}</td>
                <td style={{ padding: "16px 24px" }}>
                  <button onClick={() => handleTogglePin(proj)} style={{ color: proj.isPinned ? "var(--accent)" : "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline" }}>
                    {proj.isPinned ? "Unpin" : "Pin"}
                  </button>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(proj)} style={{ color: "#3b82f6", fontSize: "0.9rem" }}>Edit</button>
                  <button onClick={() => handleDelete(proj.id)} style={{ color: "#ef4444", fontSize: "0.9rem" }}>Delete</button>
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

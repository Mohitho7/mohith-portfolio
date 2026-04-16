"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";

export default function TestimonialsClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const defaultForm = { quote: "", authorName: "", authorRole: "", authorContext: "", order: 0 };
  const [formData, setFormData] = useState(defaultForm);

  const fetchItems = async () => {
    const res = await fetch("/api/testimonials");
    if (res.ok) setItems(await res.json());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.name === "order" ? parseInt(e.target.value) || 0 : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await adminMutation(`/api/testimonials/${isEditing}`, { method: "PUT", body: formData });
    } else {
      await adminMutation("/api/testimonials", { method: "POST", body: formData });
    }
    setFormData(defaultForm);
    setIsEditing(null);
    fetchItems();
  };

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await adminMutation(`/api/testimonials/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div>
      <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} placeholder="Author Name" required style={inputStyle} />
            <input type="text" name="authorRole" value={formData.authorRole} onChange={handleChange} placeholder="Role / Company" required style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input type="text" name="authorContext" value={formData.authorContext} onChange={handleChange} placeholder="Context (e.g. Previous Manager)" style={inputStyle} />
            <input type="number" name="order" value={formData.order} onChange={handleChange} placeholder="Display Order (lower is first)" required style={inputStyle} />
          </div>
          <textarea name="quote" value={formData.quote} onChange={handleChange} placeholder="The testimonial quote..." required style={{...inputStyle, resize: "vertical", minHeight: "80px"}} />
          
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-primary">{isEditing ? "Update Testimonial" : "Create Testimonial"}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(null); setFormData(defaultForm); }} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ padding: "0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", width: "40%" }}>Author</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Context</th>
              <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: "500", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "500" }}>{item.authorName} <br/><span style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400"}}>{item.authorRole}</span></td>
                <td style={{ padding: "16px 24px", color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.authorContext || "-"}</td>
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button onClick={() => handleEdit(item)} style={{ color: "#3b82f6", fontSize: "0.9rem" }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "#ef4444", fontSize: "0.9rem" }}>Delete</button>
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

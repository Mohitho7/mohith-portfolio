"use client";

import { useState } from "react";
import { adminMutation } from "@/lib/admin-fetch";

export default function SkillsClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  
  const [catForm, setCatForm] = useState({ name: "", order: 0 });
  const [skillForm, setSkillForm] = useState({ name: "", categoryId: "", level: 5, order: 0 });

  const fetchCategories = async () => {
    const res = await fetch("/api/skill-categories");
    if (res.ok) setCategories(await res.json());
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminMutation("/api/skill-categories", { method: "POST", body: catForm });
    setCatForm({ name: "", order: 0 });
    fetchCategories();
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.categoryId) return alert("Select a category first");
    await adminMutation("/api/skills", { method: "POST", body: skillForm });
    setSkillForm({ name: "", categoryId: "", level: 5, order: 0 });
    fetchCategories();
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await adminMutation(`/api/skills/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and ALL its skills? This cannot be undone.`)) return;
    await adminMutation(`/api/skill-categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid var(--glass-border)", padding: "24px" }}>
        <div style={{ flex: "1 1 300px", paddingRight: "24px", borderRight: "1px solid var(--glass-border)", marginRight: "24px" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>Add Category</h3>
          <form onSubmit={handleCatSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="Category Name" required style={inputStyle} />
            <input type="number" value={catForm.order} onChange={e => setCatForm({...catForm, order: parseInt(e.target.value) || 0})} placeholder="Order" style={inputStyle} />
            <button type="submit" className="btn-secondary">Create Category</button>
          </form>
        </div>

        <div style={{ flex: "2 1 400px" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--accent)" }}>Add Skill</h3>
          <form onSubmit={handleSkillSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <select value={skillForm.categoryId} onChange={e => setSkillForm({...skillForm, categoryId: e.target.value})} required style={inputStyle}>
                <option value="" disabled>Select Category...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} placeholder="Skill Name" required style={inputStyle} />
            </div>
            {/* Level input (optional use) */}
            <button type="submit" className="btn-primary">Add Skill to Category</button>
          </form>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {categories.length === 0 && <p style={{ color: "var(--text-muted)" }}>No categories yet.</p>}
        {categories.map((cat: any) => (
          <div key={cat.id} style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "1.2rem" }}>{cat.name} <span style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>(Order: {cat.order})</span></h4>
              <button onClick={() => handleDeleteCategory(cat.id, cat.name)} style={{ color: "#ef4444", fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>Delete Category</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {cat.skills.length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No skills mapped.</span>}
              {cat.skills.map((s: any) => (
                <div key={s.id} style={{ padding: "6px 16px", background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "30px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  {s.name}
                  <button onClick={() => handleDeleteSkill(s.id)} style={{ color: "#ef4444", fontSize: "1.2rem", lineHeight: 1 }}>&times;</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  background: "var(--surface)",
  border: "1px solid var(--glass-border)",
  color: "var(--foreground)",
  borderRadius: "8px",
  fontFamily: "var(--font-sans)",
  outline: "none",
  flex: 1
};

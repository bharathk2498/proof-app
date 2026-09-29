"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listSubs } from "@/lib/store";

export default function Manager() {
  const [rows, setRows] = useState(listSubs());
  useEffect(() => setRows(listSubs()), []);
  return (
    <main className="wrap">
      <div className="brand"><Link href="/">Proof</Link></div>
      <h1 style={{ fontSize: 36 }}>Submissions</h1>
      {rows.length === 0 && <p>No checklists yet. Run the staff flow.</p>}
      {rows.map((s) => (
        <div className="card" key={s.id}>
          <strong>{new Date(s.at).toLocaleString()}</strong>
          <div>{s.items.filter((i) => i.done).length}/{s.items.length} complete</div>
          {s.items.map((i) => (
            <div key={i.text} style={{ marginTop: 8 }}>
              {i.done ? "✓" : "○"} {i.text}
              {i.photo && <img className="preview" src={i.photo} alt="" />}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}

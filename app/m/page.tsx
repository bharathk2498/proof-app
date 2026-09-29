"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE, addSub } from "@/lib/store";

export default function Staff() {
  const router = useRouter();
  const [items, setItems] = useState(TEMPLATE.map((text) => ({ text, done: false, photo: "" })));

  function photo(i: number, file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...items];
      next[i].photo = String(reader.result);
      next[i].done = true;
      setItems(next);
    };
    reader.readAsDataURL(file);
  }

  function submit() {
    addSub({ id: crypto.randomUUID(), at: new Date().toISOString(), items });
    router.push("/app");
  }

  return (
    <main className="wrap">
      <div className="brand">Proof · opening</div>
      <h1 style={{ fontSize: 36 }}>Today</h1>
      {items.map((it, i) => (
        <div className="card check" key={it.text}>
          <input type="checkbox" checked={it.done} onChange={(e) => {
            const next = [...items]; next[i].done = e.target.checked; setItems(next);
          }} />
          <div style={{ flex: 1 }}>
            <div>{it.text}</div>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => photo(i, e.target.files?.[0])} />
            {it.photo && <img className="preview" src={it.photo} alt="" />}
          </div>
        </div>
      ))}
      <button className="btn" onClick={submit}>Submit proof</button>
    </main>
  );
}

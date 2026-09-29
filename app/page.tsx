import Link from "next/link";
export default function Home() {
  return (
    <main className="wrap">
      <div className="brand">Proof</div>
      <h1>Know it happened.</h1>
      <p>Checklists with photos. Managers stop guessing. Staff finish the list in minutes.</p>
      <div style={{ marginTop: 28 }}>
        <Link className="btn" href="/m">Staff checklist</Link>
        <Link className="btn" href="/app" style={{ background: "transparent", color: "#7dffb3", border: "1px solid #1d3b2e" }}>Manager</Link>
      </div>
    </main>
  );
}

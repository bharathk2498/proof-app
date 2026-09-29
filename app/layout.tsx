import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Proof — See the work", description: "Photo-verified checklists for real locations." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

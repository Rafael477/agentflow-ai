import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentFlow AI",
  description: "SaaS multicanal para agentes de IA"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark" data-theme="dark">
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("agentflow-theme")==="light"?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`
          }}
        />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";

export const metadata: Metadata = {
  title: "RTK Chat",
  description: "Real-time chat app built with RTK Query and Socket.IO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
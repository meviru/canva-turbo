import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { StoreProvider } from "./store";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Cavna Clone",
  description: "Canva clone using Next.js, Express.js and MongoDB",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        <StoreProvider>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              {children}
              <Toaster />
            </StackTheme>
          </StackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Challenge 26 - SSR Repo Card",
  description: "Server side rendering with TanStack Query",
};

export default function RootLayout({ children }) {
  // TODO: wrap children in Providers
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

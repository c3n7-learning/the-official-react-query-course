import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Challenge 26 - SSR Repo Card",
  description: "Server side rendering with TanStack Query",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "@/styles/globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="light" lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

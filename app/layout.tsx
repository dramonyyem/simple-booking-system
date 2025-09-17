import "@/styles/globals.css";
import { Providers } from "./providers";

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <UserProvider>{children}</UserProvider>
        </Providers>
      </body>
    </html>
  );
}

// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <body>
        <main className="dark text-foreground">{children}</main>
      </body>
    </HeroUIProvider>
  );
}

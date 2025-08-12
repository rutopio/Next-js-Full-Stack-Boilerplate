// Reference: https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2999470492

"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

import type { ThemeProviderProps } from "next-themes";

const initialRender = process.env.NODE_ENV === "production";

export function NextThemeProvider(props: ThemeProviderProps) {
  const [shouldRender, setShouldRender] = useState(initialRender);
  useEffect(() => {
    if (!initialRender) {
      setShouldRender(true);
    }
  }, []);
  return shouldRender ? <ThemeProvider {...props} /> : props.children;
}

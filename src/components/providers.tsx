"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { SidebarProvider } from "@/lib/hooks/use-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <SidebarProvider>
                <TooltipProvider>{children}</TooltipProvider>
            </SidebarProvider>
        </NextThemesProvider>
    );
}

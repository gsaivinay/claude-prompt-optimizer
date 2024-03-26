import { Button } from "@/components/ui/button";
import { IconGitHub } from "@/components/ui/icons";
import { ThemeToggle } from "./theme-toggle";
import { Suspense } from "react";

async function UserOrLogin() {
    return <div className="flex items-center">Claude 3 Prompt Optimizer</div>;
}

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
            <div className="flex items-center">
                <Suspense fallback={<div className="flex-1 overflow-auto" />}>
                    <UserOrLogin />
                </Suspense>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <ThemeToggle />
                <Button asChild variant={"outline"}>
                    <a
                        target="_blank"
                        href="https://github.com/gsaivinay/claude-prompt-optimizer"
                        rel="noopener noreferrer"
                    >
                        <IconGitHub />
                        <span className="ml-2 hidden md:flex">GitHub</span>
                    </a>
                </Button>
            </div>
        </header>
    );
}

"use client";

import { useCompletion } from "ai/react";
import { LoaderCircle } from "lucide-react";

import { InputForm } from "@/components/input-form";
import { toast } from "react-hot-toast";
import { ClaudeOutput } from "@/components/claude-output";

export default function Dashboard() {
    const { completion, complete, stop, isLoading, error } = useCompletion();

    if (error) {
        toast.error(
            `There is an error while generating prompt. Please try again. \n\n ${error.message}`,
        );
    }
    return (
        <>
            <div className="flex w-full flex-col ">
                <div className="flex flex-col sm:gap-4 sm:py-4">
                    <main className="grid flex-1 items-start gap-4 p-4 sm:py-0">
                        <div className="mx-auto grid flex-1 auto-rows-max gap-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                                <InputForm
                                    complete={complete}
                                    isLoading={isLoading}
                                />
                                {error ? (
                                    <p className="text-center text-red-500">
                                        There is an error while generating
                                        prompt. <br />
                                        {error.message}
                                    </p>
                                ) : (
                                    <ClaudeOutput
                                        output={completion || ""}
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {isLoading && (
                <div className="max-w-dvw fixed inset-0 z-40 m-auto flex h-screen max-h-dvh w-dvw items-center justify-center text-secondary-foreground backdrop-blur-sm">
                    <span className="rounded-lg backdrop-blur-3xl shadow-primary shadow-[0_0_16px_0px_rgba(0,0,0,0),_0_2px_4px_-2px_rgb(0,0,0,0.1)] p-2">
                        <LoaderCircle className="z-50 size-16 animate-spin" />
                        Loading...
                    </span>
                </div>
            )}
        </>
    );
}

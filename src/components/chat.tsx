"use client";

import { useCompletion } from "ai/react";
import { InputForm } from "@/components/input-form";
import { toast } from "react-hot-toast";
import { ClaudeOutput } from "./claude-output";

export function Chat() {
    const { completion, complete, stop, isLoading, error } = useCompletion();

    if (error) {
        toast.error(
            "There is an error while generating prompt. Please try again...",
        );
    }

    return (
        <div className="m-auto flex flex-col gap-4 max-w-5xl">
            <div className="pt-4 md:pt-6">
                <InputForm complete={complete} isLoading={isLoading} />
            </div>
            <div className="grow min-h-64">
                {error ? (
                    <p className="text-center text-red-500">
                        There is an error while generating prompt. Please try
                        again...
                    </p>
                ) : (
                    <ClaudeOutput
                        output={completion || ""}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}

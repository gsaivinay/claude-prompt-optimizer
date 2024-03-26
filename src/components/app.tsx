"use client";

import { useCompletion } from "ai/react";
import { InputForm } from "@/components/input-form";
import { toast } from "react-hot-toast";
import { ClaudeOutput } from "./claude-output";

export function App() {
    const { completion, complete, stop, isLoading, error } = useCompletion();

    if (error) {
        toast.error(
            `There is an error while generating prompt. Please try again. \n\n ${error.message}`,
        );
    }

    return (
        <div className="m-auto flex max-w-5xl flex-col gap-4">
            <div className="pt-4 md:pt-6">
                <InputForm complete={complete} isLoading={isLoading} />
            </div>
            <div className="min-h-64 grow">
                {error ? (
                    <p className="text-center text-red-500">
                        There is an error while generating prompt. <br />
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
    );
}

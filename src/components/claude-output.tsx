import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "@/components/markdown";

function extractBetweenTags(
    tag: string,
    string: string,
    strip = false,
): string[] {
    let extList =
        string.match(new RegExp(`<${tag}>(.+?)</${tag}>`, "gs")) || [];
    if (strip) {
        // @ts-ignore
        extList = extList.map(e => e.trim());
    }
    return extList;
}

function removeEmptyTags(text: string) {
    return text.replace(/&lt;(\w+)&gt;&lt;\/\1&gt;$/, "");
}

function extractPrompt(metapromptResponse: string) {
    if (!metapromptResponse || metapromptResponse == "") {
        return "";
    }
    if (metapromptResponse == "Loading...") {
        return "Loading...";
    }
    let betweenTags = extractBetweenTags("Instructions", metapromptResponse)[0];
    betweenTags = removeEmptyTags(removeEmptyTags(betweenTags).trim()).trim();
    return betweenTags;
}

function extractVariables(prompt: string) {
    let pattern = /{([^}]+)}/g;
    let variables = prompt.match(pattern) || [];
    return new Set(variables);
}

export function ClaudeOutput({
    output,
    isLoading,
}: {
    output: string;
    isLoading: boolean;
}) {
    return (
        <div className="max-w-full px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    Claude 3 optimized prompt
                </h1>
                <div className="rounded-lg border border-border mt-4 p-4 flex flex-col items-start space-y-2">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        <MemoizedReactMarkdown
                            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                            remarkPlugins={[remarkGfm, remarkMath]}
                            components={{
                                p({ children }) {
                                    return (
                                        <p className="mb-2 last:mb-0">
                                            {children}
                                        </p>
                                    );
                                },
                                code({
                                    node,
                                    inline,
                                    className,
                                    children,
                                    ...props
                                }) {
                                    if (children.length) {
                                        if (children[0] == "▍") {
                                            return (
                                                <span className="mt-1 cursor-default animate-pulse">
                                                    ▍
                                                </span>
                                            );
                                        }

                                        children[0] = (
                                            children[0] as string
                                        ).replace("`▍`", "▍");
                                    }

                                    const match = /language-(\w+)/.exec(
                                        className || "",
                                    );

                                    if (inline) {
                                        return (
                                            <code
                                                className={className}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    }

                                    return (
                                        <CodeBlock
                                            key={Math.random()}
                                            language={(match && match[1]) || ""}
                                            value={String(children).replace(
                                                /\n$/,
                                                "",
                                            )}
                                            {...props}
                                        />
                                    );
                                },
                            }}
                        >
                           {extractPrompt(output)}
                        </MemoizedReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
}

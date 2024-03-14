import { MemoizedReactMarkdown } from "@/components/markdown";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@/components/ui/icons";

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
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

    const onCopy = () => {
        if (isCopied) return;
        copyToClipboard(extractPrompt(output));
    };

    return (
        <div className="max-w-full px-4">
            <div className="rounded-lg border bg-background p-8">
                <div className="flex justify-between m-0 p-0">
                    <h1 className="mb-2 text-lg font-semibold">
                        Claude 3 optimized prompt
                    </h1>
                    <span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-xs focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
                            onClick={onCopy}
                            disabled={isLoading}
                        >
                            {isCopied ? <IconCheck /> : <IconCopy />}
                            <span className="sr-only">Copy code</span>
                        </Button>
                    </span>
                </div>
                <div className="rounded-lg border border-border mt-4 p-4 flex flex-col items-start space-y-2">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        <MemoizedReactMarkdown
                            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                        >
                            {extractPrompt(output)}
                        </MemoizedReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
}

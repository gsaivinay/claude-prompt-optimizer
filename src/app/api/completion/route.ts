import Anthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { metaprompt } from "@/lib/metaprompt";

// Create an Anthropic API client (that's edge friendly)
// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY || "",
// });

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

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
    let betweenTags = extractBetweenTags("Instructions", metapromptResponse)[0];
    betweenTags = removeEmptyTags(removeEmptyTags(betweenTags).trim()).trim();
    return betweenTags;
}

function extractVariables(prompt: string) {
    let pattern = /{([^}]+)}/g;
    let variables = prompt.match(pattern) || [];
    return new Set(variables);
}

export async function POST(req: Request) {
    const { prompt, apiKey } = await req.json();

    if (!apiKey || apiKey.length === 0) {
        return new Response("Missing API key", { status: 400 });
    }

    const anthropic = new Anthropic({
        apiKey,
    });

    const finalPrompt = metaprompt.replace("{{TASK}}", prompt);

    const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: finalPrompt,
            },
        ],
    });

    const output = response.content[0].text;
    return new Response(extractPrompt(output));
}

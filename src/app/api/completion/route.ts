import Anthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { metaprompt } from "@/lib/metaprompt";
import { NextResponse } from "next/server";
import { AnthropicError } from "@anthropic-ai/sdk/error";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

function safeJSON(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return undefined;
    }
}

export async function POST(req: Request) {
    const { prompt, apiKey } = await req.json();

    if (!apiKey || apiKey.length === 0) {
        return new Response("Missing API key", { status: 400 });
    }

    const finalPrompt = metaprompt.replace("{{TASK}}", prompt);

    const anthropic = new Anthropic({
        apiKey,
    });

    try {
        const response = await anthropic.completions.create({
            model: "claude-3-opus-20240229",
            stream: true,
            max_tokens_to_sample: 4096,
            prompt: `Human: ${finalPrompt}\n\nAssistant:`,
        });
        const stream = AnthropicStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        if (
            error instanceof AnthropicError ||
            error instanceof Anthropic.APIError
        ) {
            const message =
                safeJSON(error.message.split(/\s(.*)/s)[1] || "")?.error
                    ?.message || "Error";
            console.log(message);
            return NextResponse.json(message, { status: 500 });
        }
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

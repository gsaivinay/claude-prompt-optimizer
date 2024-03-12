import Anthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { metaprompt } from "@/lib/metaprompt";
import { NextResponse } from "next/server";
import { AnthropicError } from "@anthropic-ai/sdk/error";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

function safeJSON(text: string) {
    try {
        console.log(text);
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

    const response = anthropic.messages.stream({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: finalPrompt,
            },
        ],
    });
    try {
        // Convert the response into a friendly text-stream
        const stream = AnthropicStream(response);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        if (error instanceof AnthropicError || error instanceof Anthropic.APIError) {
            console.log(error.message.split(/\s(.*)/s));
            const message =
                safeJSON(error.message.split(/\s(.*)/s)[1] || "")?.error
                    ?.message || "Error";
            console.log(message);
            return new Response(message, { status: 500 });
        }
        return new Response("Error", { status: 500 });
    }
}

import Anthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { metaprompt } from "@/lib/metaprompt";

// Create an Anthropic API client (that's edge friendly)
// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY || "",
// });

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
    const { prompt, apiKey } = await req.json();

    if (!apiKey || apiKey.length === 0) {
        return new Response("Missing API key", { status: 400 });
    }

    const anthropic = new Anthropic({
        apiKey,
    });

    const finalPrompt = metaprompt.replace("{{TASK}}", prompt);

    const response = await anthropic.messages.stream({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: finalPrompt,
            },
        ],
    });

    // Convert the response into a friendly text-stream
    const stream = AnthropicStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}

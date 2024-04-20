import Anthropic from "@anthropic-ai/sdk";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { metaprompt } from "@/lib/metaprompt";
import { NextResponse } from "next/server";
import { AnthropicError } from "@anthropic-ai/sdk/error";
import type { MessageParam } from "@anthropic-ai/sdk/resources";

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
    const { prompt, apiKey, model, variables } = await req.json();

    const validModels = [
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
    ];

    if (!validModels.includes(model)) {
        return new Response("Invalid model", { status: 400 });
    }

    if (!apiKey || apiKey.length === 0) {
        return new Response("Missing API key", { status: 400 });
    }

    const finalPrompt = metaprompt.replace("{{TASK}}", prompt);
    let assistantPartial = "<Inputs>";
    if (variables && variables !== "") {
        assistantPartial += `\n${variables.split(",").join("\n")}\n</Inputs><Instructions Structure>`;
    }

    const messages: MessageParam[] = [
        { role: "user", content: finalPrompt },
        {
            role: "assistant",
            content: "<Inputs>",
        },
    ];

    const anthropic = new Anthropic({
        apiKey,
    });
    let resolver: (value: unknown) => void;

    // create a dummy promise to resolve later conditionally
    const dummyPromise = new Promise(resolve => {
        resolver = resolve;
    });

    // track error manually because Vercel AI SDK is not playing nice with Anthropic messages stream API
    let errorStatus = false;
    let errorMessage = "";

    try {
        const response = anthropic.messages
            .stream({
                model: model,
                max_tokens: 4096,
                messages: messages,
            })
            .on("error", error => {
                const message =
                    safeJSON(error.message.split(/\s(.*)/s)[1] || "")?.error
                        ?.message || "Error";
                console.error(message);
                errorStatus = true;
                errorMessage = message;
                resolver(true);
            })
            .on("connect", () => {
                resolver(true);
            });

        await dummyPromise;
        if (errorStatus) {
            return NextResponse.json(errorMessage, { status: 500 });
        }
        const stream = AnthropicStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

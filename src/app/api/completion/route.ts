import { metaprompt } from "@/lib/metaprompt";
import { NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, convertToCoreMessages } from "ai";

export async function POST(req: Request) {
    const { prompt, apiKey, model, variables } = await req.json();

    const anthropic = createAnthropic({
        apiKey: apiKey,
        // baseURL: "http://127.0.0.1:3019/v1",
    });

    const validModels = [
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
        "claude-3-5-sonnet-20240620",
        "claude-3-5-sonnet-20241022",
        "claude-3-5-haiku-20241022",
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

    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: finalPrompt,
                    experimental_providerMetadata: {
                        anthropic: { cacheControl: { type: "ephemeral" } },
                    },
                },
                {
                    type: "text",
                    text: `
That concludes the instuctions and examples. Now, here is the task for which I would like you to write instructions:

<Task>
${prompt}
</Task>`,
                },
            ],
        },
        {
            role: "assistant",
            content: "<Inputs>",
        },
    ];

    const result = streamText({
        model: anthropic(model, {
            cacheControl: true,
        }),
        maxTokens: 4096,
        //@ts-expect-error - AI SDK typing issue
        messages: messages,
    });
    return result.toDataStreamResponse({ sendUsage: true });
}

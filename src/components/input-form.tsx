import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { RequestOptions } from "ai";

export function InputForm({
    isLoading,
    complete,
}: {
    isLoading: boolean;
    complete: (
        prompt: string,
        options?: RequestOptions | undefined,
    ) => Promise<string | null | undefined>;
}) {
    const formSchema = z.object({
        apiKey: z.string().min(30),
        input: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     input: input,
        // },
        disabled: isLoading,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        complete(values.input, {
            body: {
                apiKey: values.apiKey,
            },
        });
    }
    return (
        <div className="mx-auto max-w-full px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    Welcome to Claude 3 Prompt Optimizer
                </h1>
                <h3>Please run this project in your local if you are facing timeout errors due to vercel edge functions</h3>
                <div className="mt-4 flex flex-col items-start space-y-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Anthropic API key</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="sk-ant-..."
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="input"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Draft an email responding to a customer complaint"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormDescription className="prose">
                                Enter your task in the cell above. Here are some
                                examples for inspiration:
                                <ul>
                                    <li>
                                        Choose an item from a menu for given
                                        user preferences
                                    </li>
                                    <li>Rate a resume according to a rubric</li>
                                    <li>
                                        Explain a complex scientific concept in
                                        simple terms
                                    </li>
                                    <li>
                                        Draft an email responding to a customer
                                        complaint
                                    </li>
                                    <li>
                                        Design a marketing strategy for
                                        launching a new product
                                    </li>
                                </ul>
                                Next, we&apos;ll insert your task into the metaprompt
                                and see what Claude gives us! Expect this to
                                take 20-30 seconds because the Metaprompt is so
                                long.
                            </FormDescription>
                            <Button disabled={isLoading} type="submit">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

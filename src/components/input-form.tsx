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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        input: z.string().min(5).max(10000),
        model: z.string().min(1),
        variables: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            model: "claude-3-opus-20240229",
        },
        disabled: isLoading,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        complete(values.input, {
            body: {
                apiKey: values.apiKey,
                model: values.model,
                variables: values.variables,
            },
        });
    }
    return (
        <div className="mx-auto max-w-full px-4">
            <div className="rounded-lg border bg-background p-6 shadow-lg shadow-primary/35">
                <h1 className="text-lg font-semibold">
                    Welcome to Claude 3 Prompt Optimizer
                </h1>
                <span className="text-sm">
                    Please run this project in your local if you are facing
                    timeout errors due to vercel edge functions
                </span>
                <div className="mt-2 flex flex-col items-start space-y-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-4"
                        >
                            <div className="flex w-full flex-col gap-4 md:flex-row">
                                <FormField
                                    control={form.control}
                                    name="apiKey"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            <FormLabel>
                                                Anthropic API key
                                            </FormLabel>
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
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem className="min-w-40">
                                            <FormLabel>Model</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={
                                                    "claude-3-opus-20240229"
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="claude-3-opus-20240229">
                                                        Claude 3 Opus
                                                    </SelectItem>
                                                    <SelectItem value="claude-3-sonnet-20240229">
                                                        Claude 3 Sonnet
                                                    </SelectItem>
                                                    <SelectItem value="claude-3-haiku-20240307">
                                                        Claude 3 Haiku
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="@container">
                                <div className="@xl:flex-row flex w-full flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="input"
                                        render={({ field }) => (
                                            <FormItem className="grow">
                                                <FormLabel>Task</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="h-[15ch] min-w-[20ch]"
                                                        placeholder="Draft an email responding to a customer complaint"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="prose max-w-[45ch] text-[0.8rem] text-neutral-500 dark:text-neutral-400">
                                        Enter your task in the text area. Here
                                        are some examples for inspiration:
                                        <ul>
                                            <li>
                                                Rate a resume according to a
                                                rubric
                                            </li>
                                            <li>
                                                Draft an email responding to a
                                                customer complaint
                                            </li>
                                            <li>
                                                Design a marketing strategy for
                                                launching a new product
                                            </li>
                                        </ul>
                                        Next, we&apos;ll insert your task into
                                        the metaprompt and see what Claude gives
                                        us! Expect this to take 20-30 seconds
                                        because the Metaprompt is so long.
                                    </div>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="variables"
                                render={({ field }) => (
                                    <FormItem className="grow">
                                        <FormLabel>
                                            Variables in the task (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Optional: specify the comma
                                            separated variables you want Claude
                                            to use.{" "}
                                            <b>
                                                If you want Claude to choose,
                                                you can leave this empty.
                                            </b>{" "}
                                            <br /> Example variables for
                                            &quot;Draft an email responding to a
                                            customer complaint&quot; task:
                                            CUSTOMER_COMPLAINT, COMPANY_NAME
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

import { Chat } from "@/components/chat";

export interface ChatPageProps {
    params: {
        id: string;
    };
}

export default async function ChatPage({ params }: ChatPageProps) {

    return <Chat />;
}

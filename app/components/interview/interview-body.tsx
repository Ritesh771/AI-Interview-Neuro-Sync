"use client";
import { handleCompleteInterviewAction } from "@/app/lib/form-actions";
import { useLiveSession } from "@/hooks/useLiveSession";
import { ConnectionState } from "@/lib/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";


export interface SavedMessage {
    role: 'assistant' | 'user',
    content: string
}

type CompleteInterviewType = {
    id: string,
    conversation: SavedMessage[];
    userid: string | undefined;
};

type InterviewBodyprops = {
    id: string
    questions: string;
    startInterview: boolean;
    handleLastMessageChange: (message: string) => void;
    isHangingUp: boolean;
}



const InterviewBody = ({ id, questions, startInterview, handleLastMessageChange, isHangingUp }: InterviewBodyprops) => {

    const session = useSession();
    const router = useRouter();

    const [conversation, setConversation] = React.useState<string[]>([]);

    const handleMessage = (message: string, isUser: boolean) => {
        setConversation(prev => [...prev, `${isUser ? 'You' : 'Interviewer'}: ${message}`]);
    };

    const { connect, disconnect, connectionState, error, volume } = useLiveSession(handleMessage);

    const [savedMessage, setsavedMessage] = React.useState<SavedMessage[]>([]);
    const [isCompleting, setIsCompleting] = React.useState(false);

    const handlehangUp = useCallback(async () => {
        // Convert conversation to SavedMessage format
        const formattedMessages: SavedMessage[] = conversation.map(msg => {
            const [role, content] = msg.split(': ', 2);
            return {
                role: role === 'You' ? 'user' : 'assistant',
                content: content || ''
            };
        });
        setsavedMessage(formattedMessages);

        const completeInterviewData: CompleteInterviewType = {
            id: id,
            userid: session.data?.user?.id,
            conversation: formattedMessages
        }

        setIsCompleting(true);
        try {
            const result = await handleCompleteInterviewAction(completeInterviewData);
            if (result.success) {
                console.log("Interview completed successfully");
            } else {
                console.error("Failed to complete interview:", result.error);
            }
        } catch (error) {
            console.error("Error completing interview:", error);
        } finally {
            setIsCompleting(false);
        }
    }, [conversation, id, session.data?.user?.id])

    useEffect(() => {
        if (startInterview) {
            const systemInstruction = `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
First, start by introducing yourself and asking about the candidate's background:
- Greet the candidate professionally
- Ask about their current role, experience, and career goals
- Ask about their motivation for applying to this position

Then, proceed to the structured question flow:
${questions}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`;

            connect(systemInstruction);
        }
    }, [startInterview, questions, connect])

    useEffect(() => {
        if (isHangingUp) {
            disconnect();
            handlehangUp();
        }
    }, [isHangingUp, disconnect, handlehangUp])

    useEffect(() => {
        if (isHangingUp && !isCompleting) {
            router.push("/dashboard");
        }
    }, [isHangingUp, isCompleting, router])

    return (
        <section className="flex items-center justify-center gap-6 z-60">
            {isCompleting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Generating your feedback...</p>
                        <p className="text-sm text-gray-600">Please wait while we analyze your interview</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center h-[400px] w-full max-w-xl p-6 border-2 border-black rounded-[45px] bg-[#e7e9fb] shadow-md ">
                <div className="relative w-60 h-60 flex items-center justify-center">
                    {
                        volume > 10 &&
                        <div className="absolute w-28 h-28 bg-[#f78c74]/45 rounded-full animate-ping z-10" />
                    }
                    <Image
                        src="/robot-orange.png"
                        alt="NeuroSync Interviewer"
                        width={240}
                        height={240}
                        className="rounded-full animate-pulse p-4 z-20 pointer-events-none"
                    />
                </div>
                <span className="text-xl font-semibold text-center">NeuroSync Interviewer</span>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center h-[400px] w-full max-w-xl p-6 border-2 border-black rounded-[45px] bg-[#e7e9fb] shadow-md gap-4">
                <Image
                    src={session.data?.user?.image || "/profile-image.png"}
                    alt="User Image"
                    width={180}
                    height={180}
                    className="rounded-full pointer-events-none"
                />
                <span className="text-xl font-semibold text-center">
                    {session.data?.user?.name || "You"} (You)
                </span>
            </div>
        </section>
    );

}

export default InterviewBody
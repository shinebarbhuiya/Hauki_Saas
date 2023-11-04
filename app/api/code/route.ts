import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi} from "openai";

import {ChatCompletionRequestMessage} from "openai"

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "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"
})

const openai = new OpenAIApi(configuration);

const instructionMessage : ChatCompletionRequestMessage = {
    role: "system",
    content: "You are the best code generator that exists on the market. You answer in markdown code snippets along with comments for explanations. And your code are the best ones. You name is Hauki"
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAi API Key not configured", {status: 500})
        }


        if (!messages) {
            return new NextResponse("Messages are required" , { status: 400})
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial has expired.", { status: 403 })
        }

     


        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages : [instructionMessage, ...messages]
        });

        await increaseApiLimit();

        return NextResponse.json(response.data.choices[0].message)


    } catch (error) {
        console.log("[CODE_ERROR", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}
import { StreamingTextResponse, LangChainStream } from "ai"
//import { Readable } from 'stream';
import { currentUser } from "@clerk/nextjs/server"
//import { CallbackManager } from "langchain/callbacks"
import { Replicate } from "@langchain/community/llms/replicate";
import { NextResponse } from "next/server"

import { MemoryManager } from "@/lib/memory"
import { rateLimit } from "@/lib/rate-limit"
import prismadb from "@/lib/prismadb"


export async function POST(req: Request, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { prompt } = await req.json()
    const user = await currentUser()
    const chatId = (await params).chatId

    if (!user || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const identifier = req.url + "-" + user.id
    const { success } = await rateLimit(identifier)

    if (!success) {
      return new NextResponse("Too many requests", { status: 429 })
    }

    const companion = await prismadb.companion.update({
      where: {
        id: chatId,
      },
      data: {
        messages: {
          create: {
            role: "user",
            content: prompt,
            userId: user.id,
          }
        }
      }
    })

    if (!companion) {
      return new NextResponse("No companion found", { status: 404 })
    }

    const name = companion.id;
    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama2-13b"
    };

    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

    const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

    const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name);

    let relevantHistory = "";

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const { handlers } = LangChainStream();

    const model = new Replicate({
      model: "meta/llama-2-13b-chat:f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
      input: {
        max_length: 2048,
        temperature: 0.75,
        top_p: 0.9,
        repetition_penalty: 1.2
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbacks: [handlers]
    });

    model.verbose = true;

    const resp = String(
      await model.call(
        `ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.
        ${companion.instructions} 
        Below are the relevant details about ${name}'s past and the conversation you are in.'
        ${relevantHistory}

        ${recentChatHistory}\n${name};
        `
      ).catch((err: unknown) => console.log("Error in model.call", err))
    )

    const cleaned = resp.replaceAll(",", "");
    //    const chunks = cleaned.split("\n");
    //    const response = chunks[0]

    const lines = cleaned.split("\n").filter((line) => line.trim().length > 0); // Split and remove empty lines
    const response = lines.slice(-2).join("\n"); // Get the last 2 lines and join them with a newline
    //    const response = cleaned.substring(cleaned.lastIndexOf("\n") + 1).trim();

    await memoryManager.writeToHistory("" + response.trim(), companionKey);
    // eslint-disable-next-line 
    const Readable = require('stream').Readable;

    const s = new Readable();
    s.push(response);
    s.push(null);

    if (response.length > 0 || response !== undefined) {
      memoryManager.writeToHistory("" + response.trim(), companionKey);
      await prismadb.companion.update({
        where: {
          id: chatId,
        },
        data: {
          messages: {
            create: {
              role: "system",
              content: response.trim(),
              userId: user.id,
            }
          }
        },
      })
    }

    return new StreamingTextResponse(s);

  } catch (error) {
    console.log("Error in POST route of chatId", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}



//public async init() {
//  if (this.vectorDBClient instanceof PineconeClient) {
//    await this.vectorDBClient.init({
//      apiKey: process.env.PINECONE_API_KEY!,
//      environment: process.env.PINECONE_ENVIRONMENT,
//    });
//  }
  //}

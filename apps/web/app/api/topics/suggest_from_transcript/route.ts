import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

// Define the input schema
const InputSchema = z.object({
    transcript: z.string(),
    userProfiles: z.array(z.any()),
    existingSuggestedTopics: z.array(z.object({
        type: z.string(),
        content: z.string(),
    })),
});

// Use the same OutputSchema as in the original route.ts
const OutputSchema = z.object({
    thoughts: z.array(z.string()).describe("Use chain of thought reasoning to explain your thinking."),
    needsNewTopics: z.boolean().describe("True if the conversation needs new topics, false if there are enough topics already."),
    topics: z.array(z.object({
        type: z.enum(['find-out', 'shared-go-deeper', 'navigate-tension']),
        title: z.string(),
        content: z.string(),
    })),
});

type OutputType = z.infer<typeof OutputSchema>;

export async function POST(request: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const body = await request.json();
        const { transcript, userProfiles, existingSuggestedTopics } = InputSchema.parse(body);

        const topics = await generateTopicsFromTranscript(openai, transcript, userProfiles, existingSuggestedTopics);
        return NextResponse.json(topics);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }
}

async function generateTopicsFromTranscript(
    openai: OpenAI,
    transcript: string,
    userProfiles: z.infer<typeof InputSchema>['userProfiles'],
    existingSuggestedTopics: z.infer<typeof InputSchema>['existingSuggestedTopics']
): Promise<OutputType> {
    try {
        const prompt = `
            <CRITICAL>
                REMEMBER: the topics should be short, concise, and under 10 words.
            </CRITICAL>
            You are an insightful and empathetic matchmaker. Your task is to analyze a conversation transcript, two dating profiles, and existing suggested topics to generate new personalized conversation tips. The output should be in JSON format, providing tailored advice for the conversation.

            Given the following:
            
            <UserProfiles>
                ${JSON.stringify(userProfiles)}
            </UserProfiles>

            <ExistingSuggestedTopics>
                ${JSON.stringify(existingSuggestedTopics)}
            </ExistingSuggestedTopics>

            <TranscriptOfCurrentConversation>
                ${transcript}
            </TranscriptOfCurrentConversation>

            Please:
            1. Analyze the transcript to understand the current state of the conversation.
            2. Consider the user profiles and existing suggested topics.
            3. Generate new topics that build upon the conversation and profiles, avoiding repetition of existing topics.

            Generate a small number of new topics for each category:
            - "FindOut": Areas where they need more information about each other.
            - "GoDeep": Shared passions, interests, or values they can explore in depth.
            - "navigate-tension": Differences or potential conflicts they should be aware of.

            Make sure the topics are concise and short, ideally just under 10 words.
            Include a catchy title for each topic.

            Return the result as a JSON object with a "topics" array containing objects with "type", "title", and "content" properties.

            <CRITICAL>
                REMEMBER: the topics should be short, concise, and under 10 words.
            </CRITICAL>

            <CRITICAL>
                Order the topics appropriately on the order of priority.
            </CRITICAL>

            <TypeExplanations>
                <TypeExplanation type="find-out">
                    This is meant for things which are appealing to one person, but where it's not clear if the other person will find it appealing.
                </TypeExplanation>
                <TypeExplanation type="shared-go-deeper">
                    The topic is about exploring shared interests or experiences in more depth.
                </TypeExplanation>
                <TypeExplanation type="navigate-tension">
                    The topic is about exploring possible tensions or conflict between the user's profiles.
                </TypeExplanation>
            </TypeExplanations>

            <CRITICAL>
                REMEMBER: the topics should be short, concise, and under 10 words.
            </CRITICAL>
        `;

        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates conversation topics for dates based on transcripts and profiles." },
                { role: "user", content: prompt }
            ],
            response_format: zodResponseFormat(OutputSchema, 'topics'),
        });

        const generatedContent = response.choices[0]?.message.parsed;
        if (!generatedContent) {
            throw new Error('No content generated');
        }

        return generatedContent;
    }
    catch (error) {
        console.error('Error generating topics from transcript:', error);
        throw new Error('Failed to generate topics from transcript');
    }
}

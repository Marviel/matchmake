import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { z } from 'zod';

// Define the input schema
const InputSchema = z.object({
    userProfiles: z.array(z.any()),
    alreadySuggestedTopics: z.array(z.object({
        type: z.string(),
        content: z.string(),
    })),
});

// Define the output schema
const OutputSchema = z.object({
    topics: z.array(z.object({
        type: z.enum(['find-out', 'shared-go-deeper', 'find-tension']),
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
        const { userProfiles, alreadySuggestedTopics } = InputSchema.parse(body);

        const topics = await generateTopics(openai, userProfiles, alreadySuggestedTopics);
        return NextResponse.json(topics);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }
}

async function generateTopics(
    openai: OpenAI,
    userProfiles: z.infer<typeof InputSchema>['userProfiles'],
    alreadySuggestedTopics: z.infer<typeof InputSchema>['alreadySuggestedTopics']
): Promise<OutputType> {
    try {
        const prompt = `
            Generate 3 new conversation topics for a date based on the following user profiles and already suggested topics.
            User Profiles: ${JSON.stringify(userProfiles)}
            Already Suggested Topics: ${JSON.stringify(alreadySuggestedTopics)}
            
            Each topic should have a type of either "find-out", "shared-go-deeper", or "find-tension".
            Return the result as a JSON object with a "topics" array containing objects with "type" and "content" properties.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates conversation topics for dates." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const generatedContent = response.choices[0]?.message.content;
        if (!generatedContent) {
            throw new Error('No content generated');
        }

        const parsedContent = JSON.parse(generatedContent);
        return OutputSchema.parse(parsedContent);
    }
    catch (error) {
        console.error('Error generating topics:', error);
        throw new Error('Failed to generate topics');
    }
}
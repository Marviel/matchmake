import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

// Define the input schema
const InputSchema = z.object({
    userProfiles: z.array(z.any()),
    alreadySuggestedTopics: z.array(z.object({
        type: z.string(),
        content: z.string(),
    })),
});

// Update the OutputSchema
const OutputSchema = z.object({
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
            
            Each topic should have a type of either "find-out", "shared-go-deeper", or "navigate-tension".
            Also, include a catchy title for each topic.
            Return the result as a JSON object with a "topics" array containing objects with "type", "title", and "content" properties.

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
        `;

        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates conversation topics for dates." },
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
        console.error('Error generating topics:', error);
        throw new Error('Failed to generate topics');
    }
}
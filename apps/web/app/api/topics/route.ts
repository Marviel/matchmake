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
            <CRITICAL>
                REMEMBER: the topics should be short, concise, and under 10 words.
            </CRITICAL>
            You are an insightful and empathetic matchmaker. Your task is to analyze two dating profiles and generate personalized conversation tips for their first date. The output should be in JSON format, providing tailored advice for each person.
            Given the two dating User Profiles and already suggested topics: ${JSON.stringify(userProfiles)},  Already Suggested Topics: ${JSON.stringify(alreadySuggestedTopics)}, please
            
            Identify shared interests, values, and goals.
            Recognize unique aspects of each person that their date might want to know more about.
            
            Generate a small number of "FindOut" topics: Areas where they need more information about their date, and a small number of "GoDeep" topics: Shared passions, interests, or values they can explore in depth, and a small number of “navigate-tension” topics: differences that users can be aware of. 
            
            Make sure the topics are concise and short, ideally just under 10 words. 
            
            Also, include a catchy title for each topic.
            
            Return the result as a JSON object with a "topics" array containing objects with "type", "title", and "content" properties.

            <CRITICAL>
                REMEMBER: the topics should be short, concise, and under 10 words.
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

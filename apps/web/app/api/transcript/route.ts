import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { z } from 'zod';

// Define the input schema
const InputSchema = z.object({
    audio: z.string(), // base64-encoded audio
});

// Define the output schema
const OutputSchema = z.object({
    transcript: z.string(),
});

export async function POST(request: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const body = await request.json();
        const { audio } = InputSchema.parse(body);

        // Decode the base64 audio
        const audioBuffer = Buffer.from(audio, 'base64');

        // Create a temporary file with a .wav extension
        const tempFilePath = `/tmp/audio_${Date.now()}.wav`;
        require('fs').writeFileSync(tempFilePath, audioBuffer);

        // Transcribe the audio using Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: require('fs').createReadStream(tempFilePath),
            model: 'whisper-1',
            language: 'en'
        });

        // Delete the temporary file
        require('fs').unlinkSync(tempFilePath);

        // Return the transcript
        const result = OutputSchema.parse({ transcript: transcription.text });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid input or transcription failed' }, { status: 400 });
    }
}
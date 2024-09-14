export interface UserProfile {
    name: string;
    body: string;
}

export interface SuggestedTopic {
    type: string;
    topic: string;
}

export interface Topic {
    id: string;
    content: string;
    depth: number;
}
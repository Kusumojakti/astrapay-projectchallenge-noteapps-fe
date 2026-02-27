export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updateAt: string;
    displayColor?: string
}

export interface NoteServiceState {
    notes: Note[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null
}
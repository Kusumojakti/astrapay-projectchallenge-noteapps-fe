export interface CreateNoteRequest {
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title: string;
    content: string;
}

export interface NoteResponse {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
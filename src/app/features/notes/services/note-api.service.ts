import { HttpClient } from "@angular/common/http";
import { Note } from "../interfaces/note.interface";
import { CreateNoteRequest, UpdateNoteRequest } from "../interfaces/note-api.interface";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root' 
})
export class NoteApiService {
    private http = inject(HttpClient)

    private apiUrl = 'http://localhost:8000/api/v1/notes';

    getNotes() {
        return this.http.get<Note[]>(this.apiUrl)
    }

    createNote(data: CreateNoteRequest) {
        return this.http.post<Note>(this.apiUrl, data)
    }

    updateNote(id: string, data: UpdateNoteRequest) {
        return this.http.put<Note>(`${this.apiUrl}/${id}`, data);
    }

    deleteNote(id: string) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
import { inject, Injectable } from "@angular/core";
import { NoteApiService } from "./note-api.service";
import { BehaviorSubject } from "rxjs";
import { Note } from "../interfaces/note.interface";

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    private noteApi = inject(NoteApiService);

    private noteSubject = new BehaviorSubject<Note[]>([]);
    notes$ = this.noteSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    // =====================
    // COLOR SYSTEM
    // =====================
    private colors = [
        'bg-orange-300',
        'bg-yellow-300',
        'bg-purple-300',
        'bg-green-300',
        'bg-pink-300',
        'bg-blue-300'
    ];

    private getColorById(id: string) {
        const index = id.charCodeAt(0) % this.colors.length;
        return this.colors[index];
    }

    private enrichNote(note: any): Note {
        return {
            ...note,
            displayColor: this.getColorById(note.id)
        };
    }

    private normalizeResponse(res: any) {
        return Array.isArray(res) ? res : (res?.data || []);
    }

    // =====================
    // LOAD NOTES
    // =====================
    getNotes() {
        this.loadingSubject.next(true);

        this.noteApi.getNotes().subscribe({
            next: (res: any) => {
                const notes = this.normalizeResponse(res)
                    .map((n: Note) => this.enrichNote(n));

                this.noteSubject.next(notes);
                this.loadingSubject.next(false);
            },
            error: () => {
                this.errorSubject.next('Failed to load notes');
                this.loadingSubject.next(false);
            }
        });
    }

    // =====================
    // CREATE NOTE
    // =====================
    addNotes(title: string, content: string) {
        this.loadingSubject.next(true);

        this.noteApi.createNote({ title, content }).subscribe({
            next: (res: any) => {
                const note = this.enrichNote(res.data || res);

                this.noteSubject.next([note, ...this.noteSubject.value]);
                this.loadingSubject.next(false);
            },
            error: () => {
                this.errorSubject.next('Failed to create note');
                this.loadingSubject.next(false);
            }
        });
    }

    // =====================
    // UPDATE NOTE
    // =====================
    updateNote(id: string, title: string, content: string) {
        this.loadingSubject.next(true);

        this.noteApi.updateNote(id, { title, content }).subscribe({
            next: (res: any) => {
                const updated = this.enrichNote(res.data || res);

                const updatedNotes = this.noteSubject.value.map((n: Note) =>
                    n.id === id ? updated : n
                );

                this.noteSubject.next(updatedNotes);
                this.loadingSubject.next(false);
            },
            error: () => {
                this.errorSubject.next('Failed to update note');
                this.loadingSubject.next(false);
            }
        });
    }

    // =====================
    // DELETE NOTE
    // =====================
    deleteNote(id: string) {
        this.loadingSubject.next(true);

        this.noteApi.deleteNote(id).subscribe({
            next: () => {
                const filtered = this.noteSubject.value.filter(n => n.id !== id);
                this.noteSubject.next(filtered);
                this.loadingSubject.next(false);
            },
            error: () => {
                this.errorSubject.next('Failed to delete note');
                this.loadingSubject.next(false);
            }
        });
    }
}
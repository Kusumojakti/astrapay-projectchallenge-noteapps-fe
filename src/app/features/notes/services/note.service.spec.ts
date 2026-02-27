import { TestBed } from '@angular/core/testing';
import { NoteService } from './note.service';
import { NoteApiService } from './note-api.service';
import { of, throwError } from 'rxjs';
import { Note } from '../interfaces/note.interface';

describe('NoteService', () => {
    let service: NoteService;
    let apiService: jasmine.SpyObj<NoteApiService>;

    const mockNote: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Isi test',
        displayColor: '',
        createdAt: '',
        updateAt: ''
    };

    beforeEach(() => {
        const spy = jasmine.createSpyObj('NoteApiService', [
            'getNotes',
            'createNote',
            'updateNote',
            'deleteNote'
        ]);

        TestBed.configureTestingModule({
            providers: [
                NoteService,
                { provide: NoteApiService, useValue: spy }
            ]
        });

        service = TestBed.inject(NoteService);
        apiService = TestBed.inject(NoteApiService) as jasmine.SpyObj<NoteApiService>;
    });

    it('should load notes successfully', (done) => {
        apiService.getNotes.and.returnValue(of([mockNote]));

        service.getNotes();

        service.notes$.subscribe(notes => {
            if (notes.length > 0) {
                expect(notes.length).toBe(1);
                expect(notes[0].title).toBe('Test Note');
                done();
            }
        });
    });

    it('should handle error when loading notes', (done) => {
        apiService.getNotes.and.returnValue(throwError(() => new Error()));

        service.getNotes();

        service.error$.subscribe(err => {
            if (err) {
                expect(err).toBe('Failed to load notes');
                done();
            }
        });
    });

    it('should add note', (done) => {
        apiService.createNote.and.returnValue(of(mockNote));

        service.addNotes('Test Note', 'Isi test');

        service.notes$.subscribe(notes => {
            if (notes.length > 0) {
                expect(notes.length).toBe(1);
                expect(notes[0].title).toBe('Test Note');
                done();
            }
        });
    });

    it('should update note', (done) => {
        const updatedNote = { ...mockNote, title: 'Updated' };

        apiService.getNotes.and.returnValue(of([mockNote]));
        apiService.updateNote.and.returnValue(of(updatedNote));

        service.getNotes();

        setTimeout(() => {
            service.updateNote('1', 'Updated', 'Isi baru');

            service.notes$.subscribe(notes => {
                const found = notes.find(n => n.id === '1');
                if (found?.title === 'Updated') {
                    expect(found.title).toBe('Updated');
                    done();
                }
            });
        });
    });

    it('should delete note', (done) => {
        apiService.getNotes.and.returnValue(of([mockNote]));
        apiService.deleteNote.and.returnValue(of(void 0));

        service.getNotes();

        setTimeout(() => {
            service.deleteNote('1');

            service.notes$.subscribe(notes => {
                expect(notes.length).toBe(0);
                done();
            });
        });
    });
});
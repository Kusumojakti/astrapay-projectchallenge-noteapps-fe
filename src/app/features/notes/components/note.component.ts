import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  private noteService = inject(NoteService);

  notes$ = this.noteService.notes$;
  loading$ = this.noteService.loading$;
  error$ = this.noteService.error$;

  colors = [
    'bg-orange-300',
    'bg-yellow-300',
    'bg-purple-300',
    'bg-green-300',
    'bg-pink-300',
    'bg-blue-300'
  ];

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  showModal = false;
  isEdit = false;
  isSubmitted = false;

  form = {
    id: '',
    title: '',
    content: '',
  };

  ngOnInit() {
    this.noteService.getNotes();
  }

  openAdd() {
    this.isEdit = false;
    this.isSubmitted = false;
    this.form = { id: '', title: '', content: '' };
    this.showModal = true;
  }

  openEdit(note: any) {
    this.isEdit = true;
    this.form = {
      id: note.id,
      title: note.title,
      content: note.content,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitted = false;
  }

  saveNote() {
    this.isSubmitted = true;
    if (!this.form.title || !this.form.content) {
      console.log('Validation failed!');
      return;
    }

    if (this.isEdit) {
      this.noteService.updateNote(
        this.form.id,
        this.form.title,
        this.form.content
      );
    } else {
      this.noteService.addNotes(this.form.title, this.form.content);
    }

    this.closeModal();
  }

  deleteNote(id: string) {
    if (!confirm('Delete this note?')) return;
    this.noteService.deleteNote(id);
  }
}

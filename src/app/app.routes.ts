import { Routes } from '@angular/router';
import { NoteComponent } from './features/notes/components/note.component';

export const routes: Routes = [
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: 'notes', component: NoteComponent }
];

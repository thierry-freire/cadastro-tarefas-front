import { Routes } from '@angular/router';
import { EventoListaComponent } from './components/evento-lista/evento-lista.component';
import { EventoFormComponent } from './components/evento-form/evento-form.component';
import { EventoDetalhesComponent } from './components/evento-detalhes/evento-detalhes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    component: EventoListaComponent
  },
  {
    path: 'events/new',
    component: EventoFormComponent
  },
  {
    path: 'events/:id',
    component: EventoDetalhesComponent
  },
  {
    path: 'events/:id/edit',
    component: EventoFormComponent
  }
];

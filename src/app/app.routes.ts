import { Routes } from '@angular/router';
import { TarefaListaComponent } from './components/tarefa-lista/tarefa-lista.component';
import { TarefaFormComponent } from './components/tarefa-form/tarefa-form.component';
import { TarefaDetalhesComponent } from './components/tarefa-detalhes/tarefa-detalhes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    component: TarefaListaComponent
  },
  {
    path: 'events/new',
    component: TarefaFormComponent
  },
  {
    path: 'events/:id',
    component: TarefaDetalhesComponent
  },
  {
    path: 'events/:id/edit',
    component: TarefaFormComponent
  }
];

import { Routes } from '@angular/router';
import { TarefaListaComponent } from './components/tarefa-lista/tarefa-lista.component';
import { TarefaFormComponent } from './components/tarefa-form/tarefa-form.component';
import { TarefaDetalhesComponent } from './components/tarefa-detalhes/tarefa-detalhes.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'tasks',
    component: TarefaListaComponent
  },
  {
    path: 'tasks/new',
    component: TarefaFormComponent
  },
  {
    path: 'tasks/:id',
    component: TarefaDetalhesComponent
  },
  {
    path: 'tasks/:id/edit',
    component: TarefaFormComponent
  }
];

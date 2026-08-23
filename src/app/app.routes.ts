import { Routes } from '@angular/router';
import { TarefaListaComponent } from './components/tarefa-lista/tarefa-lista.component';
import { TarefaFormComponent } from './components/tarefa-form/tarefa-form.component';
import { TarefaDetalhesComponent } from './components/tarefa-detalhes/tarefa-detalhes.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

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
    component: TarefaListaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',
    component: TarefaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id',
    component: TarefaDetalhesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: TarefaFormComponent,
    canActivate: [authGuard]
  }
];

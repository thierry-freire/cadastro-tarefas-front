import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';
import { MatOption } from "@angular/material/core";

@Component({
  selector: 'app-tarefa-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatChipsModule, MatOption],
  templateUrl: './tarefa-lista.component.html',
  styleUrl: './tarefa-lista.component.scss'
})
export class TarefaListaComponent implements OnInit {
  tarefas: Tarefa[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  page = 0;
  pageSize = 5;
  totalPages = 0;
  totalElements = 0;
  status: string = '';
  responsavel: string = '';

  constructor(
    private tarefaService: TarefaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const success = params.get('success');
      const error = params.get('error');

      this.successMessage = success ?? '';
      this.errorMessage = error ?? '';
      this.loadTarefas();
    });
  }

  loadTarefas(): void {
    this.loading = true;
    this.errorMessage = '';
    this.tarefaService.list(this.page, this.pageSize, this.status, this.responsavel).subscribe({
      next: (response) => {
        this.tarefas = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar as tarefas.';
        this.loading = false;
      }
    });
  }

  deleteTarefa(id?: number): void {
    if (!id) {
      return;
    }

    if (!confirm('Deseja realmente excluir esta tarefa?')) {
      return;
    }

    this.loading = true;
    this.tarefaService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Tarefa removida com sucesso.';
        this.loadTarefas();
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover a tarefa.';
        this.loading = false;
      }
    });
  }

  changePage(step: number): void {
    this.page += step;
    if (this.page < 0) {
      this.page = 0;
    }
    if (this.page >= this.totalPages) {
      this.page = Math.max(0, this.totalPages - 1);
    }
    this.loadTarefas();
  }
}

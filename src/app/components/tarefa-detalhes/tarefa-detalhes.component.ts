import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-tarefa-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatToolbarModule],
  templateUrl: './tarefa-detalhes.component.html',
  styleUrl: './tarefa-detalhes.component.scss',
  providers: [DatePipe]
})
export class TarefaDetalhesComponent implements OnInit {
  tarefa?: Tarefa;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tarefaService: TarefaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTarefa(Number(id));
    } else {
      this.errorMessage = 'Tarefa não encontrada.';
    }
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
        this.router.navigate(['/'], { queryParams: { success: this.successMessage } });
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover a tarefa.';
        this.loading = false;
      }
    });
  }

  private loadTarefa(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.tarefaService.getById(id).subscribe({
      next: (tarefa) => {
        this.tarefa = tarefa;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os detalhes da tarefa.';
        this.loading = false;
      }
    });
  }
}

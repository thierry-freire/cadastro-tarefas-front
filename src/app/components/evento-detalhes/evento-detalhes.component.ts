import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-evento-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatToolbarModule],
  templateUrl: './evento-detalhes.component.html',
  styleUrl: './evento-detalhes.component.scss',
  providers: [DatePipe]
})
export class EventoDetalhesComponent implements OnInit {
  evento?: Evento;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvento(Number(id));
    } else {
      this.errorMessage = 'Evento não encontrado.';
    }
  }

  deleteEvento(id?: number): void {
    if (!id) {
      return;
    }

    if (!confirm('Deseja realmente excluir este evento?')) {
      return;
    }

    this.loading = true;
    this.eventoService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Evento removido com sucesso.';
        this.router.navigate(['/'], { queryParams: { success: this.successMessage } });
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover o evento.';
        this.loading = false;
      }
    });
  }

  private loadEvento(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.eventoService.getById(id).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os detalhes do evento.';
        this.loading = false;
      }
    });
  }
}

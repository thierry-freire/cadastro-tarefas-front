import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-evento-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evento-lista.component.html',
  styleUrl: './evento-lista.component.scss'
})
export class EventoListaComponent implements OnInit {
  eventos: Evento[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  page = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const success = params.get('success');
      const error = params.get('error');

      this.successMessage = success ?? '';
      this.errorMessage = error ?? '';
      this.loadEventos();
    });
  }

  loadEventos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.eventoService.list(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.eventos = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os eventos.';
        this.loading = false;
      }
    });
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
        this.loadEventos();
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover o evento.';
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
    this.loadEventos();
  }
}

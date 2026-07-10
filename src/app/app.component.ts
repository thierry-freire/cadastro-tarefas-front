import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from './services/evento.service';
import { Evento } from './models/evento';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  eventos: Evento[] = [];
  eventoForm: Evento = this.createEmptyEvento();
  isEditing = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  page = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.loadEventos();
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

  onSubmit(): void {
    if (!this.eventoForm.titulo || !this.eventoForm.descricao || !this.eventoForm.data || !this.eventoForm.local) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = this.isEditing && this.eventoForm.id != null
      ? this.eventoService.update(this.eventoForm.id, this.eventoForm)
      : this.eventoService.create(this.eventoForm);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Evento atualizado com sucesso.' : 'Evento cadastrado com sucesso.';
        this.resetForm();
        this.loadEventos();
      },
      error: () => {
        this.errorMessage = 'Não foi possível salvar o evento.';
        this.loading = false;
      }
    });
  }

  editEvento(evento: Evento): void {
    this.eventoForm = { ...evento, data: this.formatDateForInput(evento.data) };
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
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

  resetForm(): void {
    this.eventoForm = this.createEmptyEvento();
    this.isEditing = false;
    this.loading = false;
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

  private createEmptyEvento(): Evento {
    return {
      titulo: '',
      descricao: '',
      data: '',
      local: ''
    };
  }

  private formatDateForInput(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    return date.toISOString().slice(0, 16);
  }
}

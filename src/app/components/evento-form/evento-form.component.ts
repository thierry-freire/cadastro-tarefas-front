import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.scss'
})
export class EventoFormComponent implements OnInit {
  eventoForm: Evento = this.createEmptyEvento();
  isEditing = false;
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
      this.isEditing = true;
      this.loadEvento(Number(id));
    }
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
        this.router.navigate(['/'], { queryParams: { success: this.successMessage } });
      },
      error: () => {
        this.errorMessage = 'Não foi possível salvar o evento.';
        this.loading = false;
      }
    });
  }

  private loadEvento(id: number): void {
    this.loading = true;
    this.eventoService.getById(id).subscribe({
      next: (evento) => {
        this.eventoForm = { ...evento, data: this.formatDateForInput(evento.data) };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o evento.';
        this.loading = false;
      }
    });
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

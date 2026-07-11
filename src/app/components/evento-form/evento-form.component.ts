import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ErroResponse } from '../../models/evento';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.scss'
})
export class EventoFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      local: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadEvento(Number(id));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const evento: Evento = this.form.value;
    const request = this.isEditing && evento.id != null
      ? this.eventoService.update(evento.id, evento)
      : this.eventoService.create(evento);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Evento atualizado com sucesso.' : 'Evento cadastrado com sucesso.';
        this.router.navigate(['/events'], { queryParams: { success: this.successMessage } });
      },
      error: (response) => {
        let errorMessages: ErroResponse = response.error;
        this.errorMessage = errorMessages.titulo ? `Título: ${errorMessages.titulo}\n` : '';
        this.errorMessage += errorMessages.descricao ? `Descrição: ${errorMessages.descricao}\n` : '';
        this.errorMessage += errorMessages.data ? `Data: ${errorMessages.data}\n` : '';
        this.errorMessage += errorMessages.local ? `Local: ${errorMessages.local}\n` : '';
        this.loading = false;
      }
    });
  }

  private loadEvento(id: number): void {
    this.loading = true;
    this.eventoService.getById(id).subscribe({
      next: (evento) => {
        this.form.patchValue({
          ...evento,
          data: this.formatDateForInput(evento.data)
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o evento.';
        this.loading = false;
      }
    });
  }

  private formatDateForInput(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    return date.toISOString().slice(0, 16);
  }
}

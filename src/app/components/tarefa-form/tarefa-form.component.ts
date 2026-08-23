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
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';
import { ErroResponse } from '../../models/tarefa';

@Component({
  selector: 'app-tarefa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule],
  templateUrl: './tarefa-form.component.html',
  styleUrl: './tarefa-form.component.scss'
})
export class TarefaFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tarefaService: TarefaService,
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
      this.loadTarefa(Number(id));
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

    const tarefa: Tarefa = this.form.value;
    const request = this.isEditing && tarefa.id != null
      ? this.tarefaService.update(tarefa.id, tarefa)
      : this.tarefaService.create(tarefa);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Tarefa atualizada com sucesso.' : 'Tarefa cadastrada com sucesso.';
        this.router.navigate(['/tasks'], { queryParams: { success: this.successMessage } });
      },
      error: (response) => {
        let errorMessages: ErroResponse = response.error;
        this.errorMessage = errorMessages.error ? `Error: ${errorMessages.error}\n` : '';
        this.errorMessage += errorMessages.path ? `Caminho: ${errorMessages.path}\n` : '';
        this.errorMessage += errorMessages.message ? `Descrição: ${errorMessages.message}\n` : '';
        this.errorMessage += errorMessages.status ? `Status: ${errorMessages.status}\n` : '';
        this.loading = false;
      }
    });
  }

  private loadTarefa(id: number): void {
    this.loading = true;
    this.tarefaService.getById(id).subscribe({
      next: (tarefa) => {
        this.form.patchValue({
          ...tarefa,
          data: this.formatDateForInput(tarefa.dataCriacao.toString())
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar a tarefa.';
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

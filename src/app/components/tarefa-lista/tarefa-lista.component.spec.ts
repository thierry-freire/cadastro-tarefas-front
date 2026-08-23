import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TarefaListaComponent } from './tarefa-lista.component';
import { TarefaService } from '../../services/tarefa.service';

describe('TarefaListaComponent', () => {
  let component: TarefaListaComponent;
  let fixture: ComponentFixture<TarefaListaComponent>;
  let tarefaService: jasmine.SpyObj<TarefaService>;

  beforeEach(async () => {
    tarefaService = jasmine.createSpyObj('TarefaService', ['list', 'delete']);
    tarefaService.list.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, size: 5, number: 0 }));

    await TestBed.configureTestingModule({
      imports: [TarefaListaComponent, NoopAnimationsModule],
      providers: [
        { provide: TarefaService, useValue: tarefaService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ success: 'Criada' })) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TarefaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load tasks with the current filters', () => {
    component.status = 'PENDENTE';
    component.responsavel = 'Thierry';

    component.loadTarefas();

    expect(tarefaService.list).toHaveBeenCalledWith(0, 5, 'PENDENTE', 'Thierry');
    expect(component.successMessage).toBe('Criada');
  });

  it('should update the list and pagination from the response', () => {
    const tasks = [{ titulo: 'Tarefa', status: 'PENDENTE' }] as any;
    tarefaService.list.and.returnValue(of({ content: tasks, totalElements: 1, totalPages: 1, size: 5, number: 0 }));

    component.loadTarefas();

    expect(component.tarefas).toEqual(tasks);
    expect(component.totalElements).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should show an error when loading tasks fails', () => {
    tarefaService.list.and.returnValue(throwError(() => new Error('network')));

    component.loadTarefas();

    expect(component.errorMessage).toBe('Não foi possível carregar as tarefas.');
    expect(component.loading).toBeFalse();
  });
});

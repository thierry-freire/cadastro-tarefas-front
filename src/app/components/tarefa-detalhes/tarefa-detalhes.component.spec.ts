import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TarefaDetalhesComponent } from './tarefa-detalhes.component';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';

describe('TarefaDetalhesComponent', () => {
  let component: TarefaDetalhesComponent;
  let fixture: ComponentFixture<TarefaDetalhesComponent>;
  let tarefaService: jasmine.SpyObj<TarefaService>;
  let router: Router;
  const tarefa = {
    id: 7,
    titulo: 'Estudar Angular',
    descricao: 'Revisar testes',
    status: 'PENDENTE',
    dataCriacao: new Date('2026-08-23T10:00:00'),
    dataConclusao: new Date('2026-08-24T10:00:00'),
    responsavel: 'Thierry'
  } as Tarefa;

  beforeEach(async () => {
    tarefaService = jasmine.createSpyObj('TarefaService', ['getById', 'delete']);
    tarefaService.getById.and.returnValue(of(tarefa));
    await TestBed.configureTestingModule({
      imports: [TarefaDetalhesComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: TarefaService, useValue: tarefaService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(TarefaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the selected task', () => {
    expect(tarefaService.getById).toHaveBeenCalledWith(7);
    expect(component.tarefa).toEqual(tarefa);
    expect(component.loading).toBeFalse();
  });

  it('should show an error when loading details fails', () => {
    tarefaService.getById.and.returnValue(throwError(() => new Error('network')));
    component.ngOnInit();

    expect(component.errorMessage).toBe('Não foi possível carregar os detalhes da tarefa.');
    expect(component.loading).toBeFalse();
  });
});

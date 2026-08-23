import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TarefaFormComponent } from './tarefa-form.component';
import { TarefaService } from '../../services/tarefa.service';

describe('TarefaFormComponent', () => {
  let component: TarefaFormComponent;
  let fixture: ComponentFixture<TarefaFormComponent>;
  let tarefaService: jasmine.SpyObj<TarefaService>;
  let router: Router;

  beforeEach(async () => {
    tarefaService = jasmine.createSpyObj('TarefaService', ['create', 'update', 'getById']);
    await TestBed.configureTestingModule({
      imports: [TarefaFormComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: TarefaService, useValue: tarefaService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(TarefaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize dataCriacao as a disabled field with a value', () => {
    expect(component.form.controls['dataCriacao'].disabled).toBeTrue();
    expect(component.form.getRawValue().dataCriacao).toContain('T');
  });

  it('should create a task with the disabled creation date', () => {
    tarefaService.create.and.returnValue(of({}));
    component.form.patchValue({ titulo: 'Tarefa', status: 'PENDENTE', responsavel: 'Thierry' });

    component.onSubmit();

    expect(tarefaService.create).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Tarefa',
      status: 'PENDENTE',
      dataCriacao: jasmine.any(String)
    }));
    expect(router.navigate).toHaveBeenCalled();
  });
});

import { ListarClienteComponent } from './listar-cliente.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ClienteService } from '../../../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../primeNg/prime-ng/prime-ng.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
describe('Listar cliente Component', () => {
    let component: ListarClienteComponent;
    let fixture: ComponentFixture<ListarClienteComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListarClienteComponent
            ],
            providers: [
                 ClienteService,
                 MessageService
            ],
            imports: [
                PrimeNgModule,
                RouterTestingModule.withRoutes([]),
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                // PrimeNgModule,Router
            ],
        })
        fixture = TestBed.createComponent(ListarClienteComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect( component).toBeTruthy();
    });
    it('debe traer clientes con un término de búsqueda', () => {
        component.listarClientes();
        fixture.detectChanges();
        const elemt: HTMLElement= fixture.debugElement.query( By.css('#table') ).nativeElement;
        expect(elemt).toBeTruthy(1);
    });
});
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

import { Patter } from '../../../../models/patters';
import { RespuestaServer } from '../../../../models/response';
import { TipoCliente } from '../../../../models/cliente/tipoCliente';
import { Cliente } from '../../../../models/cliente/cliente';

import { ClienteService } from '../../../../services/cliente.service';
import { TipoClienteService } from '../../../../services/tipo-cliente.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ValidatorService } from '../../../../services/validator.service';

@Component({
  selector: 'app-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.css'],
  providers: [ConfirmationService]
})
export class GestionClienteComponent implements OnInit {

  public clienteForm: FormGroup = this._formBuilder.group({
    nombresPersona: [ , [ Validators.required ]],
    apellidosPersona: [, [ Validators.required ]],
    cedulaPersona: [ , [ Validators.required, this._validatorService.validadorDeCedula]],
    emailPersona: [ , [  Validators.pattern(Patter.emailPattern) ]],
    tipoCliente: [ , [ Validators.required ]],
    telefonoCliente: [ ,[Validators.pattern(Patter.phonePattern)]],
  });

  public tiposCliente: TipoCliente [] = [];

  public cliente?: Cliente;
  public selectedCliente?: Cliente;
  public id?: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _clienteService: ClienteService,
    private _tiposClienteService: TipoClienteService,
    private _validatorService: ValidatorService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getTiposCliente();
    this.getClienteIdParam();
  }

  getTiposCliente = () => this._tiposClienteService.tiposCliente().subscribe({
    next: (resp: RespuestaServer) =>  this.tiposCliente = resp.respuesta, 
    error: (err: HttpErrorResponse) => this.tiposCliente = []
  });

  getClienteIdParam = () => {
    this._activatedRoute.paramMap.subscribe( params => {      
      this.id = +params.get('id')!;
      if ( this.id && !isNaN(this.id)) {
        this.getClientePorId( this.id );
      } else {
        this._router.navigate(['/dashboard/cliente/gestion/crear']);
      }
    });
  }

  getClientePorId = (id: number) => {
    this._clienteService.getPorId(id).subscribe({
      next: (resp: RespuestaServer) => {
        this.selectedCliente = resp.respuesta;
        this.clienteForm.patchValue(this.selectedCliente!);
        this.clienteForm.patchValue(this.selectedCliente?.persona!);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo encontrar ese cliente',);
          this._router.navigate(['/dashboard/cliente']);
        }
      }
    });
  }

  realizarAccion = () => {
    if (this.clienteForm.valid) {
      let { nombresPersona, apellidosPersona, cedulaPersona, emailPersona, tipoCliente, telefonoCliente } = this.clienteForm.value;
      this.cliente! = {telefonoCliente, tipoCliente};
      this.cliente!.persona = {nombresPersona, apellidosPersona, cedulaPersona, emailPersona};
      if (this.id) {
        this.cliente.persona.idPersona = this.selectedCliente?.persona?.idPersona;
        this.actualizarCliente();
      } else {
        this.cliente.estadoCliente = true;
        this.crearCliente();
      }
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }

  crearCliente = () => {
    this._clienteService.crear( this.cliente! ).subscribe({
      next: (resp: RespuestaServer) => {
        this.clienteForm.reset();
        this._msgSweetAlertService.mensajeOk('Cliente Guardado');
      }, 
      error: (err: HttpErrorResponse) => {        
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Cédula repetido');
        } else {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo guardar el cliente');
        }
      }
    });
  }

  actualizarCliente = () => {
    this.cliente!.estadoCliente = this.selectedCliente?.estadoCliente;
    this._clienteService.actualizar(this.id!, this.cliente!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Cleinte Guardado');
        this._router.navigate(['/dashboard/cliente']);
      }, 
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Cédula repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Ese cliente no existe');
          this._router.navigate(['/dashboard/cliente']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar el cliente');
        this._router.navigate(['/dashboard/cliente']);
      }
    });
  }

  eliminar = (event: Event) => {    
    this._confirmationService.confirm({
        target: event.target!,
        message: '¿Desea eliminar este cliente?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this._clienteService.eliminar(this.id!).subscribe({
              next: (resp: RespuestaServer) => {
                this._msgSweetAlertService.mensajeOk('Cliente Eliminado');
                this._router.navigate(['/dashboard/cliente']);
              }, 
              error: (err: HttpErrorResponse) => {
                this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo eliminar el cliente');
              }
            });
        }
    });
  }

  verificarCampo  = ( campo: string ): boolean => {
    return ( this.clienteForm.controls?.[campo].invalid || false) && ( this.clienteForm.controls?.[campo].touched || false );
  }

  emailErrorMsg(): string {
    const errors = this.clienteForm.get('emailPersona')?.errors;    
    if (errors?.pattern) {
      return 'Email inválido';
    }
    return '';
  }

  cedulaErrorMsg(): string {
    const errors = this.clienteForm.get('cedulaPersona')?.errors;       
    if (errors?.required) {
      return 'Campo requerido';
    } else if ( errors?.cedulaInvalida){
      return 'Cédula inválida'
    }
    return '';
  }
  numErrorMsg(campo: string): string {
    const errors = this.clienteForm.get(campo)?.errors;
    if (errors?.pattern) {
      return 'Número inválido';
    }
    return '';
  }
}

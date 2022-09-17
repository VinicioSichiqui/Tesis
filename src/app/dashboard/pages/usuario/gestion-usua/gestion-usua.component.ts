import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ValidatorService } from '../../../../services/validator.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { Patter } from '../../../../models/patters';
import { Usuario } from '../../../../models/usuario/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-usua',
  templateUrl: './gestion-usua.component.html',
  styleUrls: ['./gestion-usua.component.css'],
  providers: [ ConfirmationService ]
})
export class GestionUsuaComponent implements OnInit {
  public usuarioForm: FormGroup = this._formBuilder.group({
    nombresPersona: [ , [ Validators.required ]],
    apellidosPersona: [, [ Validators.required ]],
    cedulaPersona: [ , [ Validators.required, this._validatorService.validadorDeCedula]],
    emailPersona: [ , [  Validators.pattern(Patter.emailPattern) ]],
    passwordUsuario: [ ],
  });

  public usuario?: Usuario;
  public selectedUsuario?: Usuario;
  public id?: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _usuarioService: UsuarioService,
    private _validatorService: ValidatorService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getUsuarioIdParam();
  }

  getUsuarioIdParam = () => {
    this._activatedRoute.paramMap.subscribe( params => {      
      this.id = +params.get('id')!;
      if ( this.id && !isNaN(this.id)) {
        this.getUsuarioPorId( this.id );
      } else {        
        this._router.navigate(['/dashboard/usuario/gestion/crear']);
      }
    });
  }

  getUsuarioPorId = (id: number) => {
    this._usuarioService.getPorId(id).subscribe({
      next: (resp: RespuestaServer) => {
        this.selectedUsuario = resp.respuesta;
        this.usuarioForm.patchValue(this.selectedUsuario!);
        this.usuarioForm.patchValue(this.selectedUsuario?.persona!);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo encontrar ese usuario',);
          this._router.navigate(['/dashboard/usuario']);
        }
      }
    });
  }

  realizarAccion = () => {
    if (this.usuarioForm.valid) {
      
      let { nombresPersona, apellidosPersona, cedulaPersona, emailPersona, passwordUsuario } = this.usuarioForm.value;
      this.usuario! = {passwordUsuario};
      this.usuario!.persona = {nombresPersona, apellidosPersona, cedulaPersona, emailPersona};
      if (this.id) {
        this.usuario.persona.idPersona = this.selectedUsuario?.persona?.idPersona;
        this.actualizarUsuario();
      } else {
        this.usuario.estadoUsuario = true;
        this.crearUsuario();
      }
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }


  crearUsuario = () => {
    this._usuarioService.crear( this.usuario! ).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Usuario Guardado');
        this.usuarioForm.reset();
        this.usuarioForm.get('passwordUsuario')?.setValue('');
      }, 
      error: (err: HttpErrorResponse) => {                
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Número de cédula repetido');
        } else {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo guardar el usuario');
        }
      }
    });
  }

  actualizarUsuario = () => {
    this.usuario!.estadoUsuario = this.selectedUsuario?.estadoUsuario;
    this._usuarioService.actualizar(this.id!, this.usuario!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Usuario Guardado');
        this._router.navigate(['/dashboard/usuario']);
        this.usuarioForm.reset();
      }, 
      error: (err: HttpErrorResponse) => {
        console.log(err);
        
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Cédula repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Ese usuario no existe');
          this._router.navigate(['/dashboard/usuario']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar el usuario');
        this._router.navigate(['/dashboard/usuario']);
      }
    });
  }

  eliminar = (event: Event) => {    
    this._confirmationService.confirm({
        target: event.target!,
        message: '¿Desea eliminar este usuario?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this._usuarioService.eliminar(this.id!).subscribe({
              next: (resp: RespuestaServer) => {
                this._msgSweetAlertService.mensajeOk('Usuario Eliminado');
                this._router.navigate(['/dashboard/usuario']);
              }, 
              error: (err: HttpErrorResponse) => {
                this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo eliminar el usuario');
              }
            });
        }
    });
  }


  verificarCampo  = ( campo: string ): boolean => {
    return ( this.usuarioForm.controls?.[campo].invalid || false) && ( this.usuarioForm.controls?.[campo].touched || false );
  }

  emailErrorMsg(): string {
    const errors = this.usuarioForm.get('emailPersona')?.errors;    
    if (errors?.pattern) {
      return 'Email inválido';
    }
    return '';
  }

  cedulaErrorMsg(): string {
    const errors = this.usuarioForm.get('cedulaPersona')?.errors;       
    if (errors?.required) {
      return 'Campo requerido';
    } else if ( errors?.cedulaInvalida){
      return 'Cédula inválida'
    }
    return '';
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Patter } from '../../../../models/patters';
import { Usuario } from '../../../../models/usuario/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
import { ValidatorService } from '../../../../services/validator.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { AuthService } from '../../../../services/auth.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public usuarioForm: FormGroup = this._formBuilder.group({
    nombresPersona: [ , [ Validators.required ]],
    apellidosPersona: [, [ Validators.required ]],
    cedulaPersona: [ , [ Validators.required, this._validatorService.validadorDeCedula]],
    emailPersona: [ , [  Validators.pattern(Patter.emailPattern) ]],
    passwordUsuario: [ , [  ]],
    anteriorPasswordUsuario: [ , [ ]],
  });

  public usuario?: Usuario;
  public selectedUsuario?: Usuario;
  public id?: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _validatorService: ValidatorService,
    private _msgSweetAlertService: MsgSweetAlertService,
    public authService: AuthService,
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
        this._router.navigate(['/dashboard/home']);
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
          this._router.navigate(['/dashboard/home']);
        }
      }
    });
  }

  realizarAccion = () => {
    if (this.usuarioForm.valid) {
      
      let { nombresPersona, apellidosPersona, cedulaPersona, emailPersona, passwordUsuario, anteriorPasswordUsuario  } = this.usuarioForm.value;
      this.usuario! = {passwordUsuario,anteriorPassword: anteriorPasswordUsuario};
      this.usuario!.persona = {nombresPersona, apellidosPersona, cedulaPersona, emailPersona};
      if (this.id) {
        this.usuario.persona.idPersona = this.selectedUsuario?.persona?.idPersona;
        this.actualizarUsuario();
      } 
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  actualizarUsuario = () => {
    this.usuario!.estadoUsuario = this.selectedUsuario?.estadoUsuario;
    this._usuarioService.actualizar(this.id!, this.usuario!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Perfil Actualizado');
        this.authService.nombreUsuario$.emit(this.usuario);
        this._router.navigate(['/dashboard/home']);
        this.usuarioForm.reset();
      }, 
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Contraseña anterior no coincide');
          return;
        } else if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Cédula repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Ese usuario no existe');
          this._router.navigate(['/dashboard/Home']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar el usuario');
        this._router.navigate(['/dashboard/home']);
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

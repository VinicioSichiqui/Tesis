import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';
import { AuthService } from '../../services/auth.service';
import { MsgSweetAlertService } from '../../services/msg-sweet-alert.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public logInForm: FormGroup = this._formBuilder.group({
    cedula: [ , [Validators.required, this._validatorService.validadorDeCedula] ],
    password: [ , [Validators.required, Validators.minLength(1)] ]
  });
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _validatorService: ValidatorService,
    private _authService: AuthService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) {
  }

  ngOnInit(): void {
    //redireccionamos si el usuario esta loggeado
    if ( this._authService.isAuthenticated()){
      this._router.navigate(['dashboard']);
  }
  }

  logIn = () => {
    if (this.logInForm.valid) {
      let { cedula, password } = this.logInForm.value;
            this._msgSweetAlertService.showLoading(false,'Iniciando sesión', 'Espere por favor');
            this._authService.logIn( cedula, password ).subscribe( {
                next: (response) => {
                  this._authService.guardarToken(response.access_token);
                  this._authService.guardarUsuario(response.access_token);
                  this._router.navigate(['/dashboard'])
                  Swal.close();
                }, 
                error: (err: HttpErrorResponse) => {
                  Swal.close()
                  this._msgSweetAlertService.mensajeError('Uppps!', 'Datos erroneos!');
                }
            });
      
    } else {
      this.logInForm.markAllAsTouched();
    }
  }

  verificarCampo  = ( campo: string ): boolean => {
    return ( this.logInForm.controls?.[campo].invalid || false) && ( this.logInForm.controls?.[campo].touched || false );
  }

  cedulaErrorMsg(): string {
    const errors = this.logInForm.get('cedula')?.errors;       
    if (errors?.required) {
      return 'Campo requerido';
    } else if ( errors?.cedulaInvalida){
      return 'Cédula inválida'
    }
    return '';
  }
}

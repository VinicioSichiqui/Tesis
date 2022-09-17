import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  validadorDeCedula = (control: FormControl): ValidationErrors | null => {
    let cedula: string = control?.value?.trim() || '';
    if (cedula.length < 10) return {cedulaInvalida: true}
    if (cedula.length > 10) return {cedulaInvalida: true}

    let cedulaCorrecta = this.validarCedula(cedula);
    if (cedulaCorrecta) {      
      return null;
    }
    return {
      cedulaInvalida: true
    };
  }

  validadorDeRuc = (control: FormControl): ValidationErrors | null => {
    let ruc: string = control?.value?.trim() || '';
    if (ruc.length === 10) {
      let cedulaCorrecta = this.validarCedula(ruc);

      if (cedulaCorrecta) {      
        return null;
      }
    }
    if (ruc.length < 13) return {rucInvalida: true}
    if ( ruc.substring(10,ruc.length) != '001') return {rucInvalida: true};
    
    let cedula: string = ruc.substring(0,10);

    let cedulaCorrecta = this.validarCedula(cedula);

    if (cedulaCorrecta) {      
      return null;
    }
    return {
      rucInvalida: true
    };
  }

  validarCedula = (cedula: string): boolean => {    
    let cedulaCorrecta = false;
    if (cedula.length == 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
          digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
        }
        suma = Math.round(suma);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
          cedulaCorrecta = true;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
          cedulaCorrecta = true;
        } else {
          cedulaCorrecta = false;
        }
      } else {
        cedulaCorrecta = false;
      }
    } else {
      cedulaCorrecta = false;
    }

    return cedulaCorrecta;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor/proveedor';
import { Patter } from '../../../../models/patters';
import { ValidatorService } from '../../../../services/validator.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-prov',
  templateUrl: './gestion-prov.component.html',
  styleUrls: ['./gestion-prov.component.css'],
  providers: [ConfirmationService]
})
export class GestionProvComponent implements OnInit {
  public displayDetalles: boolean= false;

  public proveedorForm: FormGroup = this._formBuilder.group({
    nombreProveedor: [ , [ Validators.required ] ],
    rucProveedor: [ , [ Validators.required, this._validatorService.validadorDeRuc]],
    emailProveedor: [ , [ Validators.required, Validators.pattern(Patter.emailPattern) ]],
    telefonoProveedor: [ , [  Validators.pattern(Patter.telefonoPattern) ]],
    movilProveedor: [, [ Validators.pattern(Patter.movilPattern)]],
    direccionProveedor: [ , [ Validators.required ]],
  });
  public detallesForm: FormGroup = this._formBuilder.group({
    fechaIngresoDetalleProveedor: [],
    cuidadDetalleProveedor: [ ],
    descripcionDetalleProveedor: [],
  });
  
  public proveedor?: Proveedor;
  public selectedProveedor?: Proveedor;
  public id?: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _proveedorService: ProveedorService,
    private _validatorService: ValidatorService,
    private _msgSweetAlertService: MsgSweetAlertService
  ) { }

  ngOnInit(): void {
    this.getProveedorIdParam();
  }

  getProveedorIdParam = () => {
    this._activatedRoute.paramMap.subscribe( params => {      
      this.id = +params.get('id')!;
      if ( this.id && !isNaN(this.id)) {
        this.getProveedorPorId( this.id );
      } else {
        this._router.navigate(['/dashboard/proveedor/gestion/crear']);
      }
    });
  }

  getProveedorPorId = (id: number) => {
    this._proveedorService.getPorId(id).subscribe({
      next: (resp: RespuestaServer) => {
        this.selectedProveedor= resp.respuesta;
        this.proveedorForm.patchValue(resp.respuesta);
        this.verificarDetallesProveedor(resp.respuesta);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo encontrar ese proveedor',);
          this._router.navigate(['/dashboard/proveedor']);
        }
      }
    });
  }

  verificarDetallesProveedor = (proveedor: Proveedor) => {
    if ( proveedor?.detalleProveedor?.fechaIngresoDetalleProveedor) {
      this.detallesForm.get('fechaIngresoDetalleProveedor')?.patchValue(proveedor.detalleProveedor?.fechaIngresoDetalleProveedor);  
    } 
    if ( proveedor?.detalleProveedor?.cuidadDetalleProveedor ) {
      this.detallesForm.get('cuidadDetalleProveedor')?.patchValue(proveedor.detalleProveedor?.cuidadDetalleProveedor);  
    } 
    if ( proveedor?.detalleProveedor?.descripcionDetalleProveedor ) {
      this.detallesForm.get('descripcionDetalleProveedor')?.patchValue(proveedor.detalleProveedor?.descripcionDetalleProveedor);  
    } 
  }

  realizarAccion = () => {
    if (this.proveedorForm.valid) {
      this.proveedor = this.proveedorForm.value;
      this.proveedor!.detalleProveedor = this.detallesForm.value;
      this.verificarCamposDetalle();
      if (this.id) {
        this.actualizarProveedor();
      }else {
        this.proveedor!.estadoProveedor = true;
        this.crearProveedor();
      }
    } else {
      this.proveedorForm.markAllAsTouched();
    }
  }

  verificarCamposDetalle = () => {
    if (this.proveedor?.detalleProveedor?.cuidadDetalleProveedor || this.proveedor?.detalleProveedor?.fechaIngresoDetalleProveedor || this.proveedor?.detalleProveedor?.descripcionDetalleProveedor) {
      if (this.id) {
        this.proveedor.detalleProveedor.idDetalleProveedor = this.selectedProveedor?.detalleProveedor?.idDetalleProveedor;
      }
    } else {
      this.proveedor!.detalleProveedor=undefined;
    }
  }

  crearProveedor = () => {
    this._proveedorService.crear( this.proveedor! ).subscribe({
      next: (resp: RespuestaServer) => {
        this.proveedorForm.reset();
        this.detallesForm.reset();
        this._msgSweetAlertService.mensajeOk('Proveedor Guardado');
        console.log(resp);
      }, 
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Ruc repetido');
        } else {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo guardar el proveedor');
        }
      }
    });
  }

  actualizarProveedor = () => {
    this.proveedor!.estadoProveedor = this.selectedProveedor?.estadoProveedor;
    this._proveedorService.actualizar(this.id!, this.proveedor!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Proveedor Guardado');
        this._router.navigate(['/dashboard/proveedor']);
      }, 
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Ruc repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Ese proveedor no existe');
          this._router.navigate(['/dashboard/proveedor']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar el proveedor');
        this._router.navigate(['/dashboard/proveedor']);
      }
    });
  }

  eliminar = (event: Event) => {    
    this._confirmationService.confirm({
        target: event.target!,
        message: '¿Desea eliminar este proveedor?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this._proveedorService.eliminar(this.id!).subscribe({
              next: (resp: RespuestaServer) => {
                this._msgSweetAlertService.mensajeOk('Proveedor Eliminado');
                this._router.navigate(['/dashboard/proveedor']);
              }, 
              error: (err: HttpErrorResponse) => {
                this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo eliminar el proveedor');
              }
            });
        },
        reject: () => {
        }
    });
  }

  GuardarDetalles = () => {
    this.displayDetalles = false;
  }
  showDialog = () => {
    this.displayDetalles = true;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
    if (!this.id) {
      this.detallesForm.reset();
    } else {
      this.verificarDetallesProveedor(this.selectedProveedor!);
    }
  }

  verificarCampo  = ( campo: string ): boolean => {
    return ( this.proveedorForm.controls?.[campo].invalid || false) && ( this.proveedorForm.controls?.[campo].touched || false );
  }

  emailErrorMsg(): string {
    const errors = this.proveedorForm.get('emailProveedor')?.errors;    
    if (errors?.required) {
      return 'Campo requerido';
    } else if (errors?.pattern) {
      return 'Email inválido';
    }
    return '';
  }

  rucErrorMsg(): string {
    const errors = this.proveedorForm.get('rucProveedor')?.errors;       
    if (errors?.required) {
      return 'Campo requerido';
    } else if ( errors?.rucInvalida){
      return 'Ruc o Cédula inválido'
    }
    return '';
  }

  numErrorMsg(campo: string): string {
    const errors = this.proveedorForm.get(campo)?.errors;
    if (errors?.pattern) {
      return 'Número inválido';
    }
    return '';
  }
}

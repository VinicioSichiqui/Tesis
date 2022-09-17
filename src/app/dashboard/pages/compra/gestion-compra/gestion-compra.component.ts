import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

import { Compra } from '../../../../models/compra/compra';
import { Proveedor } from '../../../../models/proveedor/proveedor';
import { Producto } from '../../../../models/producto/producto';

import { RespuestaServer } from '../../../../models/response';
import { CompraService } from '../../../../services/compra.service';
import { FormaPagoService } from '../../../../services/forma-pago.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ProductoService } from '../../../../services/producto.service';
import { ProveedorService } from '../../../../services/proveedor.service';
import { DetalleCompraProducto } from '../../../../models/compra/detalleCompraProducto';
import { FormaPago } from '../../../../models/formaPago';

@Component({
  selector: 'app-gestion-compra',
  templateUrl: './gestion-compra.component.html',
  styleUrls: ['./gestion-compra.component.css'],
  providers: [ConfirmationService]
  
})
export class GestionCompraComponent implements OnInit {
  
  
  public compraForm: FormGroup = this._formBuilder.group({
    codigoCompra: [ , [ Validators.required ]],
    fechaCompra : [ , [ Validators.required ]],
    formaPago   : [ , [ Validators.required ]],
    proveedor   : [ , [ Validators.required ]],
  });

  public detalleCompraForm: FormGroup = this._formBuilder.group({
    producto: [, [ Validators.required]],
    cantidadDetalleCompraProducto: [ , [ Validators.required, Validators.min(0) ] ],
    precioDetalleCompraProducto: [ , [ Validators.required, Validators.min(0) ]],
    ivaDetalleCompraProducto: [ 12 , [ Validators.required ]],
    idDetalleCompraProducto: [],
  });
  
  
  public displayDetalles: boolean= false;
  
  public formasPago:  FormaPago [] = [];
  public proveedores: Proveedor [] = [];
  public productos:   Producto [] = [];
  public detallesCompra: DetalleCompraProducto [] = [];

  public subTotal: number = 0;
  public ivaTotal: number = 0;
  public ivaGeneral: number = 0;
  public totalCompra: number = 0;

  public id?: number;
  public compra?: Compra;
  public selectedCompra?: Compra;
  public productosError: Producto [] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _formaPagoService: FormaPagoService,
    private _proveedorService: ProveedorService,
    private _productosService: ProductoService,
    private _compraService: CompraService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getFormasPago();
    this.getProveedores();
    this.getProductos();
    this.getCompraIdParam();
  }

  getCompraIdParam = () => {
    this._activatedRoute.paramMap.subscribe( params => {      
      this.id = +params.get('id')!;
      if ( this.id && !isNaN(this.id)) {
        this.productos = [];
        this.getCompraPorId( this.id );
      } else {
        this._router.navigate(['/dashboard/compra/gestion/crear']);
      }
    });
  }

  getCompraPorId = (id: number) => {
    this._compraService.getPorId(id).subscribe({
      next: (resp: RespuestaServer) => {
        this.selectedCompra = resp.respuesta;
        this.compraForm.patchValue(resp.respuesta);
        this.ivaGeneral = this.selectedCompra?.ivaCompra!;
        this.detallesCompra = this.selectedCompra?.items!;
        this.productos = this.detallesCompra.map( item => item.producto!);
        this.calcularTotalFooter();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo encontrar esa compra',);
          this._router.navigate(['/dashboard/compra']);
        }
      }
    });
  }
  getFormasPago = () => this._formaPagoService.formasPago().subscribe({
      next: (resp: RespuestaServer) =>  this.formasPago = resp.respuesta, 
      error: (err: HttpErrorResponse) => this.formasPago = []
  });
  getProveedores = () => this._proveedorService.proveedoresPorEstado().subscribe({
      next: (resp: RespuestaServer) =>  this.proveedores = resp.respuesta, 
      error: (err: HttpErrorResponse) => this.proveedores = []
  });
  getProductos = () => this._productosService.productosPorEstado().subscribe({
      next: (resp: RespuestaServer) =>  this.productos = resp.respuesta, 
      error: (err: HttpErrorResponse) => this.productos = []
  });

  // agregar items
  agregarItem = () => {
    if (this.detalleCompraForm.valid) {
      let item: DetalleCompraProducto = this.detalleCompraForm.value;
      item.totalDetalleCompraProducto = this.calcularTotal(item);
      this.ivaGeneral = item.ivaDetalleCompraProducto!;
      this.quitarProductoItem(item.producto?.idProducto!);
      this.detallesCompra.push(item);
      this.calcularTotalFooter();
      this.detalleCompraForm.reset();
      this.detalleCompraForm.get('ivaDetalleCompraProducto')?.patchValue(this.ivaGeneral);
    } else {
      this.detalleCompraForm.markAllAsTouched();
    }
  }

  editarDetalle = (item: DetalleCompraProducto) => {
    this.detalleCompraForm.patchValue(item);
  }

  quitarProductoItem = (id: number) => {
    this.detallesCompra = this.detallesCompra.filter( detalle => detalle.producto?.idProducto != id);
    this.calcularTotalFooter();
  }
  
  calcularTotal  = (detalle: DetalleCompraProducto): number => {
    if ( detalle.ivaDetalleCompraProducto! > 0 ) {
      let subTotal = detalle.precioDetalleCompraProducto! * detalle.cantidadDetalleCompraProducto!;
      return this.round(subTotal, 2);
    } 
    return +(detalle.cantidadDetalleCompraProducto! * detalle.precioDetalleCompraProducto!).toFixed(2);
  }

  round = (num: number , decimalPlaces: number = 0) => {
    num = Math.round(+(num + 'e' + decimalPlaces));
    return Number(num + 'e' + -decimalPlaces);
  }

  calcularTotalFooter  = () => {
    this.vaciarTotales();
    for (const detalle of this.detallesCompra) {
      let subTotal = detalle.precioDetalleCompraProducto! * detalle.cantidadDetalleCompraProducto!;
      this.subTotal += subTotal;
      if ( detalle.ivaDetalleCompraProducto! > 0 ) {
        let iva = (subTotal * detalle.ivaDetalleCompraProducto!) / 100;
        this.ivaTotal += iva;
      }
    }
    this.totalCompra += this.subTotal + this.ivaTotal; 
  }

  realizarAccion = () => {
    if (this.compraForm.valid) {
      this.compra = this.compraForm.value;
      this.compra!.ivaCompra = this.ivaGeneral;
      this.compra!.totalCompra = this.round(this.totalCompra, 2);
      this.compra!.ivaTotalCompra = this.round(this.ivaTotal, 2);
      this.compra!.subTotalCompra = this.round(this.subTotal,2);
      if (this.id) {
        this.actualizarProducto();
      } else {
        this.crearCompra(this.compra!)
      }
    } else {
      this._msgSweetAlertService.mensajeAdvertencia('Por favor...', 'Ingrese los datos de la parte superior');
      this.compraForm.markAllAsTouched();
    }
  }

  crearCompra = (compra: Compra) => {
    compra.estadoCompra = true;
    if ( this.detallesCompra.length <= 0 ) {
      this._msgSweetAlertService.mensajeAdvertencia('Por favor', 'Ingrese items a la compra.');
    } else { 
      compra.items = this.detallesCompra;
      this._compraService.crear(compra).subscribe({
        next: ( resp: RespuestaServer ) => {
          this.vaciarTotales();
          this.detallesCompra = [];
          this.compraForm.reset();
          this.detalleCompraForm.get('ivaDetalleCompraProducto')?.patchValue(12);
          this._msgSweetAlertService.mensajeOk('Compra Guardada');
        },
        error: ( err: HttpErrorResponse ) => {
          if (err.status === 409) {
            this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Código  de la factura repetido');
          } else {
            this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo guardar la compra');
          }
        }
      });
    }
  }

  actualizarProducto = () => {
    this.compra!.estadoCompra = this.selectedCompra?.estadoCompra;
    this.compra!.items = this.detallesCompra;    
    this._compraService.actualizar(this.id!, this.compra!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Compra Guardada');
        this._router.navigate(['/dashboard/compra']);
      }, 
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.productosError = err.error.error as Producto[]; 
          this.showDialog();
          return;
        } if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Código  de la compra repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Esa compra no existe');
          this._router.navigate(['/dashboard/compra']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar la compra');
        this._router.navigate(['/dashboard/compra']);
      }
    });
  }

  eliminar = (event: Event) => {    
    this._confirmationService.confirm({
        target: event.target!,
        message: '¿Desea eliminar esta compra?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this._compraService.eliminar( this.id!).subscribe({
              next: (resp: RespuestaServer) => {
                this._msgSweetAlertService.mensajeOk('Compra Eliminada')
                this._router.navigate(['/dashboard/compra']);
              }, 
              error: (err: HttpErrorResponse) => {                
                if (err.status === 400) {
                  this.productosError = err.error.error as Producto[]; 
                  this.showDialog();
                  return;
                }
                this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo eliminar la compra');
              }
            });
        }
    });
  }

  showDialog = () => {
    this.displayDetalles = true;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
  }

  regresarPagina = () => window.history.back();

  vaciarTotales = () => {
    this.subTotal = 0;
    this.ivaTotal = 0;
    this.totalCompra = 0;
  }
  verificarCampo  = ( campo: string , form: FormGroup ): boolean => {
    return ( form.controls?.[campo].invalid || false) && ( form.controls?.[campo].touched || false );
  }

  numErrorMsg(campo: string): string {
    const errors = this.detalleCompraForm.get(campo)?.errors;
    if (errors?.required){
      return 'Campo requerido';
    } else if (errors?.min) {
      return 'Solo números positivos';
    }
    return '';
  }
}

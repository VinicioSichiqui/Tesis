import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../../../models/proveedor/proveedor';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ProveedorService } from '../../../../services/proveedor.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-listar-prov',
  templateUrl: './listar-prov.component.html',
  styleUrls: ['./listar-prov.component.css']
})
export class ListarProvComponent implements OnInit {

  public proveedores: Proveedor [] = [];

  public termino: string = '';

  public displayDetalles: boolean= false;

  public selectedProveedor?: Proveedor | null;
  constructor(
    private _proveedorService: ProveedorService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.listarProveedores();
  }

  listarProveedores = () => {
    this._proveedorService.proveedores().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.proveedores = resp.respuesta as Proveedor[];        
      },
      error: (err) => this.proveedores= []
    })
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.listarProveedores();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._proveedorService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.proveedores = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarProveedores();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay proveedores con ese nombre');
          }else {
            this.listarProveedores();
          }
          this.termino = '';
        }
      })
    }
  }

  actualizarEstado = (proveedor: Proveedor) => {
    this._proveedorService.actualizarEstado( proveedor.idProveedor! ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk( proveedor.estadoProveedor? 'El proveedor se encuentra disponible' : 'Proveedor dado de baja');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar el estado');
      }
    })
  }

  showDialog = (proveedor: Proveedor) => {
    this.displayDetalles = true;
    this.selectedProveedor= proveedor;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
    this.selectedProveedor= null;
  }

}

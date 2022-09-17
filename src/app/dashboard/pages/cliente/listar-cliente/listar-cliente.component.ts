import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../../../services/proveedor.service';
import { ClienteService } from '../../../../services/cliente.service';
import { RespuestaServer } from '../../../../models/response';
import { Cliente } from '../../../../models/cliente/cliente';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';

@Component({
  selector: 'app-listar-cliente',
  templateUrl: './listar-cliente.component.html',
  styleUrls: ['./listar-cliente.component.css']
})
export class ListarClienteComponent implements OnInit {

  public clientes: Cliente [] = [];
  public termino: string = '';
  public displayDetalles: boolean= false;
  public selectedCliente?: Cliente | null;

  constructor(
    private _clienteService:   ClienteService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { 
    
  }

  ngOnInit(): void {
    this.listarClientes();
  }
  listarClientes = () => {
    this._clienteService.clientes().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.clientes = resp.respuesta as Cliente[];        
      },
      error: (err) => this.clientes= []
    })
  }
  verificarTermino = () => {
    if(this.termino.length === 0) this.listarClientes();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._clienteService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.clientes = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarClientes();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No existen clientes con esa cédula');
          }else {
            this.listarClientes();
          }
          this.termino = '';
        }
      })
    }
  }
  actualizarEstado = (Cliente: Cliente) => {
    this._clienteService.actualizarEstado( Cliente.idCliente! ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk( Cliente.estadoCliente? 'El Cliente se encuentra disponible' : 'Cliente dado de baja');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar el estado');
      }
    })
  }


}

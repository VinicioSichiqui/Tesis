import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../../../services/compra.service';
import { RespuestaServer } from '../../../../models/response';
import { Compra } from '../../../../models/compra/compra';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-listar-compra',
  templateUrl: './listar-compra.component.html',
  styleUrls: ['./listar-compra.component.css']
})
export class ListarCompraComponent implements OnInit {
  
  public diaActual: Date = new Date();

  public compras: Compra [] = [];
  public termino: string = '';
  public displayDetalles: boolean= false;
  public selectedCompra?: Compra | null;

  constructor(
    private _compraService: CompraService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.listarCompras();
  }

  listarCompras = () => {
    this._compraService.compras().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.compras = resp.respuesta as Compra[]; 
      },
      error: (err) => this.compras= []
    })
  }
  
  verificarTermino = () => {
    if(this.termino.length === 0) this.listarCompras();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._compraService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.compras = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarCompras();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No existen compras con ese código');
          }else {
            this.listarCompras();
          }
          this.termino = '';
        }
      })
    }
  }

  showDialog = (compra: Compra) => {
    this.displayDetalles = true;
    this.selectedCompra= compra;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
    this.selectedCompra= null;
  }


}

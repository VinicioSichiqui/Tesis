import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto/producto';
import { ProductoService } from '../../services/producto.service';
import { RespuestaServer } from '../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public productosMenu: Producto [] = [] ;
  public productosDestacados: Producto [] = [] ;
  public responsiveOptions: any;

  public baseUrl: string = `${environment.baseUrl}/uploads/img`;
  public urlNoImage: string = `${environment.UlrNoImage}/images/no-image.jpg`;
  constructor(
    private _productoService: ProductoService,
  ) { }

  ngOnInit(): void {
    this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    this.productosDestacadosMenu();
    this.productosMenuCliente();
  }

  productosDestacadosMenu = () => {
    this._productoService.productosDestacados().subscribe({
      next: ( resp: RespuestaServer ) =>{
        this.productosDestacados = resp.respuesta;
        // console.log(this.productosDestacados);
        
      },
      error: (err: HttpErrorResponse) => {
        this.productosDestacados = [];
        console.log(err);
        
      }
    })
  }
  productosMenuCliente = () => {
    this._productoService.productosMenuCliente().subscribe({
      next: ( resp: RespuestaServer ) =>{
        this.productosMenu = resp.respuesta;
        console.log(this.productosMenu);
        
      },
      error: (err: HttpErrorResponse) => {
        this.productosMenu = [];
        console.log(err);
        
      }
    })
  }

}

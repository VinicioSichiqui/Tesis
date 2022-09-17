import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { MsgSweetAlertService } from '../../services/msg-sweet-alert.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto/producto';
import { ProductoService } from '../../services/producto.service';
import { RespuestaServer } from '../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Usuario } from '../../models/usuario/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  
  public productosStock: Producto[] = [];
  public notificacionesMenu: MenuItem [] = [];
  public menuNoti: MenuItem [] = [];
  public items: MenuItem[] = [];
  public usuario?: Usuario;

    constructor(
      private _router: Router,
      private _notificacionesService: NotificacionesService,
      private _productoService: ProductoService,
      private _usuarioService: UsuarioService,
      private _authService: AuthService,
      private _msgSweetAlertService: MsgSweetAlertService,
    ) { }

    ngOnInit() {
      this.getDatosUsuario();
        this.menuUsuario();
        this.productosSinStock();
        this.notificaciones();
    }

    getDatosUsuario = () => {
      this._usuarioService.getPorId(this._authService.usuario.idUsuario!).subscribe({
        next: (resp: RespuestaServer) => {
          this.usuario= resp.respuesta;
          let nombre = `${this.usuario!.persona?.nombresPersona?.toUpperCase() || ''} ${this.usuario!.persona?.apellidosPersona?.toUpperCase() || ''}`;
          this.cargarMenu(nombre);
        },
        error: (err:HttpErrorResponse) => {
          this._authService.logOut();
        }
      });
    }

    menuUsuario = () => {
      this._authService.nombreUsuario$.subscribe( (usuario: Usuario) => {
        let nombre = `${usuario.persona?.nombresPersona?.toUpperCase() || ''} ${usuario.persona?.apellidosPersona?.toUpperCase() || ''}`;
        this.cargarMenu(nombre);
      });
        
    }

    cargarMenu = (nombre:string) => {
      this.items = [
        {
            label: nombre,
            disabled: true
        },
        {
            label: 'Perfil',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: `usuario/gestion/perfil/${this._authService.usuario.idUsuario || ''}`
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.cerrarSesion()
        }
    ];
    }
    notificaciones = () => {
      this._notificacionesService.notificacionesMenu$.subscribe(
        (resp: any)=> {
          this.productosSinStock();
        }
      );
    }

    productosSinStock = () => {
      this.menuNoti = [];
      this._productoService.productosSinStock().subscribe({
        next: (resp: RespuestaServer) => {
          this.productosStock = resp.respuesta as Producto[];
          if ( this.productosStock.length < 0) {
            this.notificacionesMenu = [];
            this.menuNoti.push({label: 'No hay notificaciones'});
            return;
          }
          this.notificacionesMenu = this.productosStock.map( prod => {
            let item: MenuItem = {
              label: `${prod.descripcionProducto} solo hay ${prod.stockProducto} en Stock`, 
              icon: PrimeIcons.EXCLAMATION_CIRCLE,
              routerLink: this.editarStockRol(prod.idProducto!)
            };
            return item;
          });
          this.menuNoti = this.notificacionesMenu;
        },
        error: (err: HttpErrorResponse) => {
          this.notificacionesMenu = [];
          this.menuNoti.push({label: 'No hay notificaciones'});
        }
      });
    }
    editarStockRol = (id:number) => {
      if (this._authService.hasRole('ROLE_ADMINISTRADOR') || this._authService.hasRole('ROLE_INVENTARIO')) {
        return `producto/gestion/editar/${id}`
      }
      return '';
    }

    cerrarSesion = () => {
        this._msgSweetAlertService.showLoading(false, 'Cerrando sessión', 'Espere por favor');
        this._authService.logOut();
        setTimeout(() => {
          Swal.close();
          this._router.navigate(['/auth']);
        }, 200);
    }

}

import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { Rol } from '../../../../models/usuario/rol';
import { RolService } from '../../../../services/rol.service';
import { UsuarioRol } from '../../../../models/usuario/usuarioRol';
import { UsuarioRolService } from '../../../../services/usuario-rol.service';

@Component({
  selector: 'app-listar-usua',
  templateUrl: './listar-usua.component.html',
  styleUrls: ['./listar-usua.component.css']
})
export class ListarUsuaComponent implements OnInit {

  public usuarios: Usuario [] = [];

  public termino: string = '';

  public displayRol: boolean = false;
  public roles: Rol[] = [];
  public selectedUsuario?: Usuario | null;
  public selectedRol?: Rol | null;
  constructor(
    private _usuarioService: UsuarioService,
    private _rolService: RolService,
    private _usuarioRolService: UsuarioRolService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();
    this.getRoles();
  }

  getRoles = () => {
    this._rolService.roles().subscribe({
      next: (resp: RespuestaServer) => {
        this.roles = resp.respuesta;
        console.log(resp);
        
      },
      error: (err: HttpErrorResponse) => {
      }
    });
  }

  listarUsuarios = () => {
    this._usuarioService.usuarios().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.usuarios = resp.respuesta as Usuario[];        
      },
      error: (err) => this.usuarios= []
    })
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.listarUsuarios();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._usuarioService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.usuarios = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarUsuarios();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay usuarios con esa cédula');
          }else {
            this.listarUsuarios();
          }
          this.termino = '';
        }
      })
    }
  }

  actualizarEstado = (usuario: Usuario) => {
    this._usuarioService.actualizarEstado( usuario.idUsuario! ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk( usuario.estadoUsuario? 'El usuario se encuentra disponible' : 'Usuario dado de baja');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar el estado');
      }
    })
  }

  agregarRol(){
    if(this.selectedRol ){
      let rolUsuario:UsuarioRol ={
        rol:this.selectedRol!,
        usuario: this.selectedUsuario!
      }
      this._usuarioRolService.crear(rolUsuario).subscribe({
        next:(resp: RespuestaServer)=>{
          this.roles = this.roles.filter( rol => rol.idRol !== this.selectedRol?.idRol);
          let roles= [...this.selectedUsuario!.roles!, resp.respuesta];
          //@ts-ignore
          this.selectedUsuario.roles = roles;
          this._msgSweetAlertService.mensajeOk('Rol agregado');
        },
        error: (error)=>{}
        
      });
    }
  }

  eliminarRol(usuarioRol : UsuarioRol){
    this._usuarioRolService.eliminar(usuarioRol.idUsuarioRol!).subscribe({
      next:(resp)=>{
        //@ts-ignore
        this.selectedUsuario?.roles= this.selectedUsuario?.roles.filter( rolU => rolU.idUsuarioRol !== usuarioRol.idUsuarioRol);
        this.roles.push(usuarioRol.rol!);
        this._msgSweetAlertService.mensajeOk('Rol removido');
      },
      error: (error)=>{}
    });
  
  }

  showDialog = (usuario: Usuario) => {
    this.displayRol = true;
    this.selectedUsuario = usuario;
    for (const usuRol of this.selectedUsuario.roles!) {
      //@ts-ignore
      this.roles = this.roles.filter( rol => rol.idRol !== usuRol.rol.idRol);
    }
  }
  
  closeDialog = () => {
    this.displayRol = false;
    this.selectedUsuario = null;
    this.selectedRol = null;
    this.getRoles();
  }

}

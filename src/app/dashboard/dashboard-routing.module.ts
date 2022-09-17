import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { GestionProdComponent } from './pages/producto/gestion-prod/gestion-prod.component';
import { GestionProvComponent } from './pages/proveedor/gestion-prov/gestion-prov.component';
import { ListarProdComponent } from './pages/producto/listar-prod/listar-prod.component';
import { ListarProvComponent } from './pages/proveedor/listar-prov/listar-prov.component';
import { ListarCompraComponent } from './pages/compra/listar-compra/listar-compra.component';
import { GestionCompraComponent } from './pages/compra/gestion-compra/gestion-compra.component';
import { ListarClienteComponent } from './pages/cliente/listar-cliente/listar-cliente.component';
import { GestionClienteComponent } from './pages/cliente/gestion-cliente/gestion-cliente.component';
import { GestionUsuaComponent } from './pages/usuario/gestion-usua/gestion-usua.component';
import { ListarUsuaComponent } from './pages/usuario/listar-usua/listar-usua.component';
import { ListarVentaComponent } from './pages/venta/listar-venta/listar-venta.component';
import { GestionVentaComponent } from './pages/venta/gestion-venta/gestion-venta.component';
import { ReporProductoComponent } from './pages/reporte/repor-producto/repor-producto.component';
import { ReporVentaComponent } from './pages/reporte/repor-venta/repor-venta.component';
import { ReporCompraComponent } from './pages/reporte/repor-compra/repor-compra.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { RolGuard } from '../guards/rol.guard';
import { PerfilComponent } from './pages/usuario/perfil/perfil.component';
import { ProdMenuComponent } from './pages/producto/prod-menu/prod-menu.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'producto',
        component: ListarProdComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'prodmenu',
        component: ProdMenuComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'producto/gestion/crear',
        component: GestionProdComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'producto/gestion/editar/:id',
        component: GestionProdComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'proveedor',
        component: ListarProvComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'proveedor/gestion/crear',
        component: GestionProvComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'proveedor/gestion/editar/:id',
        component: GestionProvComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'compra',
        component: ListarCompraComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'compra/gestion/crear',
        component: GestionCompraComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'compra/gestion/editar/:id',
        component: GestionCompraComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'cliente',
        component: ListarClienteComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'cliente/gestion/crear',
        component: GestionClienteComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'cliente/gestion/editar/:id',
        component: GestionClienteComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'venta',
        component: ListarVentaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'venta/gestion/crear',
        component: GestionVentaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'venta/gestion/editar/:id',
        component: GestionVentaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'reporte/producto',
        component: ReporProductoComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'reporte/venta',
        component: ReporVentaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR'] }
      },
      {
        path: 'reporte/compra',
        component: ReporCompraComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: 'usuario',
        component: ListarUsuaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', ] },
      },
      {
        path: 'usuario/gestion/crear',
        component: GestionUsuaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', ] },
      },
      {
        path: 'usuario/gestion/editar/:id',
        component: GestionUsuaComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'usuario/gestion/perfil/:id',
        component: PerfilComponent,
        canActivate: [AuthGuard, RolGuard],
        data: { role: ['ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_INVENTARIO'] }
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

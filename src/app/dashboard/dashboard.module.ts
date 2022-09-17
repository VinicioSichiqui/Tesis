import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimeNgModule } from '../primeNg/prime-ng/prime-ng.module';

import { DashboardComponent } from './dashboard.component';
import { GestionProdComponent } from './pages/producto/gestion-prod/gestion-prod.component';
import { ListarProdComponent } from './pages/producto/listar-prod/listar-prod.component';
import { ListarProvComponent } from './pages/proveedor/listar-prov/listar-prov.component';
import { GestionProvComponent } from './pages/proveedor/gestion-prov/gestion-prov.component';
import { ListarCompraComponent } from './pages/compra/listar-compra/listar-compra.component';
import { GestionCompraComponent } from './pages/compra/gestion-compra/gestion-compra.component';
import { ListarClienteComponent } from './pages/cliente/listar-cliente/listar-cliente.component';
import { GestionClienteComponent } from './pages/cliente/gestion-cliente/gestion-cliente.component';
import { GestionUsuaComponent } from './pages/usuario/gestion-usua/gestion-usua.component';
import { ListarUsuaComponent } from './pages/usuario/listar-usua/listar-usua.component';
import { GestionVentaComponent } from './pages/venta/gestion-venta/gestion-venta.component';
import { ListarVentaComponent } from './pages/venta/listar-venta/listar-venta.component';
import { ReporProductoComponent } from './pages/reporte/repor-producto/repor-producto.component';
import { ReporVentaComponent } from './pages/reporte/repor-venta/repor-venta.component';
import { ReporCompraComponent } from './pages/reporte/repor-compra/repor-compra.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/usuario/perfil/perfil.component';
import { ProdMenuComponent } from './pages/producto/prod-menu/prod-menu.component';




@NgModule({
  declarations: [
    DashboardComponent, 
    GestionProdComponent, 
    ListarProdComponent, 
    ListarProvComponent, 
    GestionProvComponent, 
    ListarCompraComponent, 
    GestionCompraComponent, 
    ListarClienteComponent, 
    GestionClienteComponent, 
    GestionUsuaComponent, 
    ListarUsuaComponent, GestionVentaComponent, ListarVentaComponent, ReporProductoComponent, ReporVentaComponent, ReporCompraComponent, HomeComponent, PerfilComponent, ProdMenuComponent, 
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    PrimeNgModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DashboardModule { }

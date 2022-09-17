import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../primeNg/prime-ng/prime-ng.module';
import { MenuRoutingModule } from './menu-routing.module';

import { ClienteComponent } from './cliente/cliente.component';
import { MenuComponent } from './menu.component';


@NgModule({
  declarations: [
    ClienteComponent, 
    MenuComponent,
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    PrimeNgModule
  ]
})
export class MenuModule { }

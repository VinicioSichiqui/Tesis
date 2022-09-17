import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';
import { PrimeNgModule } from '../primeNg/prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    NavbarComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
  ],
  exports: [
    NavbarComponent,
    MenuComponent,
  ]
})
export class SharedModule { }

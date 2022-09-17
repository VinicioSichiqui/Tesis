import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public menu: MenuItem[] = [];
  constructor(
    private _menuService: MenuService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (this._authService.hasRole('ROLE_ADMINISTRADOR')) {
      this.menu = this._menuService.itemsMenuAdmin();
    } else if ( this._authService.hasRole('ROLE_VENDEDOR')) {
      this.menu = this._menuService.itemsMenuVendedor();
    } else {
      this.menu = this._menuService.itemsMenuInventario();
    }

    this.menu.shift();
  }

}

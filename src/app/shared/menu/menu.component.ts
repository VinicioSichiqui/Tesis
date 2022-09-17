import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent implements OnInit {

  constructor(
    public menuService: MenuService,
    private _authService: AuthService,
  ) { }

  items: MenuItem[] = [];
  public display?: boolean;
  ngOnInit(): void {
    if (!this._authService.usuario.roles) {
      this.items = [];
      return;
    }
    this.items = this.menuService.itemsMenu();
    this.display = this.menuService.display;
  }

}

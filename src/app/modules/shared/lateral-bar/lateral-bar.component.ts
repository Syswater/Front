import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorage } from 'src/app/app.storage';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent {
  disabled_color = '#7E86A0'
  selected = this.appStorage.selectionMenu;
  icons = [
    {
      iconPath: 'assets/icons/svg/dashboard_icon.svg',
      size: '1.8rem',
      redirectTo: 'preseller/dashboard',
      text: 'Dashboard'
    },
    {
      iconPath: 'assets/icons/svg/routes_icon.svg',
      size: '1.8rem',
      redirectTo: 'preseller/routes',
      text: 'Rutas'
    },
    {
      iconPath: 'assets/icons/svg/presales_icon.svg',
      size: '1.8rem',
      redirectTo: 'preseller/presales',
      text: 'Preventas'
    },
    {
      iconPath: 'assets/icons/svg/clients_icon.svg',
      size: '1.8rem',
      redirectTo: 'preseller/clients',
      text: 'Clientes'
    },
  ]

  constructor(private router: Router, public appStorage: AppStorage){}

  redirectTo(path: string){
    this.router.navigate([path])
  }
}

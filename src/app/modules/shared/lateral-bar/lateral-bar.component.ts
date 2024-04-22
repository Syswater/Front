import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent {
  disabled_color = '#7E86A0'
  selected = 0;
  icons = [
    {
      iconPath: 'assets/icons/svg/dashboard_icon.svg',
      size: '1.8rem',
      redirectTo: '/dashboard'
    },
    {
      iconPath: 'assets/icons/svg/routes_icon.svg',
      size: '1.8rem',
      redirectTo: '/routes'
    },
    {
      iconPath: 'assets/icons/svg/presales_icon.svg',
      size: '1.8rem',
      redirectTo: '/presales'
    },
    {
      iconPath: 'assets/icons/svg/clients_icon.svg',
      size: '1.8rem',
      redirectTo: 'preseller/clients'
    },
    {
      iconPath: 'assets/icons/svg/reports_icon.svg',
      size: '1.8rem',
      redirectTo: '/reports'
    },
  ]

  constructor(private router: Router){}

  redirectTo(path: string){
    this.router.navigate([path])
  }
}

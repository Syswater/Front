import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent implements OnInit, OnDestroy {
  @Input() mode: 'Lateral' | 'Below' = 'Lateral'
  disabled_color = '#7E86A0'
  selected = this.appStorage.selectionMenu;
  icons: any[] = []

  $reloadMenu!: Subscription

  constructor(private router: Router, public appStorage: AppStorage) {
    this.$reloadMenu = this.appStorage.getObservable('reloadLateralMenu').subscribe(() => this.ngOnInit())
  }

  ngOnDestroy(): void {
    this.$reloadMenu.unsubscribe();
  }

  ngOnInit(): void {
    const roleActual = `${localStorage.getItem('roleActual')}`
    switch (roleActual) {
      case 'Administrador':
        this.icons = this.getRoutesAdmin()
        break;
      case 'Prevendedor':
        this.icons = this.getRoutesPreseller()
        break;
      case 'Distribuidor':
        this.icons = this.getRoutesDistributor()
        break;
    }
  }

  getRoutesAdmin() {
    return [
      {
        iconPath: 'assets/icons/svg/dashboard_icon.svg',
        size: '1.8rem',
        redirectTo: 'admin/dashboard',
        text: 'Dashboard',
        index: 0
      },
      {
        iconPath: 'assets/icons/svg/routes_icon.svg',
        size: '1.8rem',
        redirectTo: 'admin/routes',
        text: 'Rutas',
        index: 1
      },
      {
        iconPath: 'assets/icons/svg/clients_icon.svg',
        size: '1.8rem',
        redirectTo: 'admin/clients',
        text: 'Clientes',
        index: 2
      },
      {
        iconPath: 'assets/icons/svg/reports_icon.svg',
        size: '1.8rem',
        redirectTo: 'admin/reports',
        text: 'Reportes',
        index: 3
      }
    ]
  }

  redirectTo(path: string) {
    this.router.navigate([path])
  }

  getRoutesPreseller() {
    return [
      {
        iconPath: 'assets/icons/svg/dashboard_icon.svg',
        size: '1.8rem',
        redirectTo: 'preseller/dashboard',
        text: 'Dashboard',
        index: 0
      },
      {
        iconPath: 'assets/icons/svg/routes_icon.svg',
        size: '1.8rem',
        redirectTo: 'preseller/routes',
        text: 'Rutas',
        index: 1
      },
      {
        iconPath: 'assets/icons/svg/presales_icon.svg',
        size: '1.8rem',
        redirectTo: 'preseller/presales',
        text: 'Preventas',
        index: 2
      },
      {
        iconPath: 'assets/icons/svg/clients_icon.svg',
        size: '1.8rem',
        redirectTo: 'preseller/clients',
        text: 'Clientes',
        index: 3
      }
    ]
  }

  getRoutesDistributor() {
    return [
      {
        iconPath: 'assets/icons/svg/dashboard_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/dashboard',
        text: 'Dashboard',
        index: 0
      },
      {
        iconPath: 'assets/icons/svg/routes_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/routes',
        text: 'Rutas',
        index: 1
      },
      {
        iconPath: 'assets/icons/svg/distribution_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/distribution',
        text: 'Distribucion',
        index: 2
      },
      {
        iconPath: 'assets/icons/svg/clients_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/clients',
        text: 'Clientes',
        index: 3
      },
      {
        iconPath: 'assets/icons/svg/expenses_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/expenses',
        text: 'Gastos',
        index: 4
      }
    ]

  }

  getPartIcons(index: number): any {
    return index == 0 ? this.icons.slice(0, Math.floor(this.icons.length / 2)) : this.icons.slice(Math.floor(this.icons.length / 2))
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent implements OnInit, OnDestroy {
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
    }
  ]

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
        break;
      case 'Prevendedor':
        this.icons = this.getRoutesPreseller()
        break;
      case 'Distribuidor':
        this.icons = this.getRoutesDistributor()
        break;
    }
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
      }
    ]

  }

  getRoutesDistributor() {
    return [
      {
        iconPath: 'assets/icons/svg/dashboard_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/dashboard',
        text: 'Dashboard'
      },
      {
        iconPath: 'assets/icons/svg/routes_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/routes',
        text: 'Rutas'
      },
      {
        iconPath: 'assets/icons/svg/distribution_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/distribution',
        text: 'Distribucion'
      },
      {
        iconPath: 'assets/icons/svg/clients_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/clients',
        text: 'Clientes'
      },
      {
        iconPath: 'assets/icons/svg/expenses_icon.svg',
        size: '1.8rem',
        redirectTo: 'distributor/expenses',
        text: 'Gastos'
      }
    ]

  }
}

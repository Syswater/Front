import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RoutesComponent } from './modules/routes/routes.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { AuthGuard } from 'src/data/guards/auth.guard';
import { PresalesComponent } from './modules/presales/presales.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'preseller', children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'routes', component: RoutesComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'presales', component: PresalesComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

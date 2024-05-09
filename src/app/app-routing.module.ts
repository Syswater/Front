import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RoutesComponent } from './modules/routes/routes.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { AuthGuard } from 'src/data/guards/auth.guard';
import { PresalesComponent } from './modules/presales/presales.component';
import { DashboardDistributorComponent } from './modules/dashboard-distributor/dashboard-distributor.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'preseller', children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'routes', component: RoutesComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'presales', component: PresalesComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'distributor', children: [
      { path: 'dashboard', component: DashboardDistributorComponent, canActivate: [AuthGuard] },
      { path: 'routes', component: RoutesComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
      { path: 'distribution', component: PresalesComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

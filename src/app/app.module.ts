import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { LoginModule } from './modules/login/login.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RoutesModule } from './modules/routes/routes.module';
import { SharedModule } from './modules/shared/shared.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AuthInterceptor } from 'src/data/interceptors/auth.interceptor';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JwtModule } from '@auth0/angular-jwt';
import { PresalesModule } from './modules/presales/presales.module';
import { MatNativeDateModule } from '@angular/material/core';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LoginModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    RoutesModule,
    SharedModule,
    PresalesModule,
    ClientsModule,
    NgxChartsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

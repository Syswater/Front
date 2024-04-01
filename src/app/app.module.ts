import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { LoginModule } from './modules/login/login.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { DashboardModule } from './modules/dashboard/dashboard.module';


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
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

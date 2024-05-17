import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { AppStorage } from './app.storage';
import { Router } from '@angular/router';
import { ModalService } from 'src/data/services/modal.service';
import { LogoutModalComponent } from './modules/login/components/logout-modal/logout-modal.component';
import { RoleComponent } from './modules/login/components/role/role.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'FrontSysWater';

  constructor(
    public auth: AuthService,
    public spinner: SpinnerService,
    public appStorage: AppStorage,
    private modalService: ModalService
  ) {
  }
  
  ngOnInit(): void {
    this.checkViewport()
  }

  logOut() {
    this.modalService.open(LogoutModalComponent)
  }

  changeRole(){
    this.modalService.open(RoleComponent)
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.appStorage.isDesktop = window.innerWidth >= 768;
  }
}

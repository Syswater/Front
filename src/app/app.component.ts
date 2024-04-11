import { Component } from '@angular/core';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontSysWater';
  isLoginView = window.location.pathname == '/login'

  constructor(public auth: AuthService, public spinner: SpinnerService){}
}

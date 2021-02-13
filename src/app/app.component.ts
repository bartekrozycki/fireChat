import { Component } from '@angular/core';
import {AuthService} from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat';

  constructor(public auth: AuthService) {
    // auth.signInWithEmail('akalik19786@gmail.pl', '1234567890');
    auth.signOut();
  }
}

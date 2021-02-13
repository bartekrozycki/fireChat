import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth-service.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

  constructor(private authService: AuthService) {
  }
  get userData(): User {
    return this.authService.user;
  }
  ngOnInit(): void {
  }

  logout(): void {
    this.authService.signOut();
  }

}

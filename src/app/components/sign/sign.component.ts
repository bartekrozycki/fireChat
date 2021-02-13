import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {

  constructor(private route: Router, private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getUserLoggedIn()) {
      this.route.navigate(['/']);
    }
  }

}

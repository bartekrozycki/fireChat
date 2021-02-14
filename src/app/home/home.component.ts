import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service.service';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userChats$;

  constructor(public auth: AuthService,
              public chatService: ChatService) { }

  ngOnInit(): void {
    this.userChats$ = this.chatService.getUserChats();
  }

  test(): void {
    this.chatService.getUserChats().subscribe(x => {
      console.log(x);
    });
  }

}

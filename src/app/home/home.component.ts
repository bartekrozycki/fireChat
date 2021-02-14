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
  currentChat: string;

  constructor(public auth: AuthService,
              public chatService: ChatService) { }

  ngOnInit(): void {
    this.userChats$ = this.chatService.getUserChats();
  }

  createChat(): void {
    this.chatService.create().then( e => {
      this.currentChat = e;
    });
  }

}

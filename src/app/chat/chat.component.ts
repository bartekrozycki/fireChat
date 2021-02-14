import {Component, OnInit} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$;
  newMessage: string;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
  }

  ngOnInit(): void {
    const chatId = this.route.snapshot.paramMap.get('id');
    console.log(chatId);
    const source = this.cs.get(chatId);
    console.log(source);
    this.chat$ = this.cs.joinUsers(source);
  }

  submit(chatId): void {
    if (!this.newMessage) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMessage);
    this.newMessage = '';
  }
}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() chatId: string;

  chat$;
  newMessage: string;
  url: string;

  siteUrl = location.origin;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const source = this.cs.get(this.chatId);
    this.chat$ = this.cs.joinUsers(source);
  }

  copyInputMessage(inputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  ngOnInit(): void {
    if (this.chatId === undefined) {
      this.chatId = this.route.snapshot.paramMap.get('id');
    }
    const source = this.cs.get(this.chatId);
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

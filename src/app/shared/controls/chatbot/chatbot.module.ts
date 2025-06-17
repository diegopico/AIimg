import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ChatbotComponent,
    ChatMessageComponent
  ],
  exports: [
    ChatbotComponent
  ]
})
export class ChatbotModule { }

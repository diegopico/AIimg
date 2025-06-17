import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from './chat-message.interface';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container" [class.visible]="visible" [class.dark]="theme === 'dark'">
      <div class="chatbot-header" [style.background-color]="primaryColor">
        <span>{{ botName }}</span>
        <button (click)="toggleChat()">×</button>
      </div>
      <div class="chatbot-messages">
        <div *ngFor="let message of messages" 
             [class.user-message]="message.sender === 'user'"
             [class.bot-message]="message.sender === 'bot'"
             class="message">
          <strong>{{ message.senderName }}:</strong>
          <p>{{ message.text }}</p>
          <small>{{ message.timestamp | date:'short' }}</small>
        </div>
      </div>
      <div class="chatbot-input">
        <input [(ngModel)]="currentMessage" 
               (keyup.enter)="sendMessage()"
               placeholder="Type a message..."
               [class.dark]="theme === 'dark'">
        <button (click)="sendMessage()" 
                [style.background-color]="primaryColor">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 400px;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      transform: translateY(100%);
    }

    .chatbot-container.visible {
      transform: translateY(0);
    }

    .chatbot-container.dark {
      background: #2d2d2d;
      color: white;
    }

    .chatbot-header {
      padding: 15px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chatbot-header button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
    }

    .message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
    }

    .user-message {
      background: #e3f2fd;
      margin-left: 20%;
    }

    .bot-message {
      background: #f5f5f5;
      margin-right: 20%;
    }

    .dark .user-message {
      background: #1e88e5;
      color: white;
    }

    .dark .bot-message {
      background: #424242;
      color: white;
    }

    .chatbot-input {
      padding: 15px;
      display: flex;
      gap: 10px;
    }

    .chatbot-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .chatbot-input input.dark {
      background: #424242;
      color: white;
      border-color: #555;
    }

    .chatbot-input button {
      padding: 8px 15px;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ChatbotComponent {
  @Input() messages: ChatMessage[] = [];
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() botName = 'AI Assistant';
  @Input() primaryColor = '#1e88e5';
  @Input() visible = false;

  @Output() sendMessage = new EventEmitter<string>();
  @Output() addSkill = new EventEmitter<void>();
  @Output() toggleChat = new EventEmitter<boolean>();

  currentMessage = '';

  onSendMessage(): void {
    if (this.currentMessage.trim()) {
      this.sendMessage.emit(this.currentMessage);
      this.currentMessage = '';
    }
  }

  onToggleChat(): void {
    this.visible = !this.visible;
    this.toggleChat.emit(this.visible);
  }

  onAddSkill(): void {
    this.addSkill.emit();
  }
} 
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../chatbot.component';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatMessageComponent implements OnInit {
  @Input() message!: ChatMessage;
  @Input() userName: string = 'You';
  @Input() botName: string = 'Bot';
  @Input() userInitial: string = 'Y';
  @Input() botInitial: string = 'B';
  @Input() primaryColor: string = '#7c3aed';
  @Input() showHeaders: boolean = false;

  formattedText: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.processMessageText();
  }

  private processMessageText(): void {
    if (!this.message.text) {
      this.formattedText = '';
      return;
    }

    // Process markdown-like syntax (simplified for this example)
    let text = this.message.text;
    
    // Convert URLs to links
    text = text.replace(
      /((https?:\/\/|www\.)[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Convert ordered lists
    const listRegex = /^(\d+\.)\s(.+)$/gm;
    text = text.replace(listRegex, '<li>$2</li>');
    
    // Convert **bold** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert `code` to <code>
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Process paragraphs and line breaks
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if needed
    if (!text.startsWith('<p>')) {
      text = '<p>' + text + '</p>';
    }
    
    // Sanitize HTML content to prevent XSS attacks
    this.formattedText = this.sanitizer.bypassSecurityTrustHtml(text);
  }
}

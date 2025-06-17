import { Component, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
// ... otros imports ...

@Component({
  selector: 'app-main',
  // ...
})
export class MainComponent implements OnInit, OnDestroy {
  // ... código existente ...
  private renderer = inject(Renderer2);
  private chatbotButtonHidden = false;

  ngOnInit(): void {
    // ... código existente ...
    this.hideChatbotButton();
  }

  ngOnDestroy(): void {
    // ... código existente ...
    this.showChatbotButton();
  }

  hideChatbotButton() {
    if (this.chatbotButtonHidden) return;
    const chatbotInstance = document.querySelector('app-chatbot');
    if (chatbotInstance) {
      this.renderer.setStyle(chatbotInstance, 'display', 'none');
      this.chatbotButtonHidden = true;
    }
  }

  showChatbotButton() {
    if (!this.chatbotButtonHidden) return;
    const chatbotInstance = document.querySelector('app-chatbot');
    if (chatbotInstance) {
      this.renderer.setStyle(chatbotInstance, 'display', 'block');
      this.chatbotButtonHidden = false;
    }
  }
  // ... resto del código ...
} 
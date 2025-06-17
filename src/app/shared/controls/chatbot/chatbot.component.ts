import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';


export interface ChatMessage {
  id: number | string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  avatar?: string;
  senderName?: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent,
          MatIconModule,
          TablerIconsModule,
          MaterialModule
  ]
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() messages: ChatMessage[] = [];
  @Input() userAvatar: string = '';
  @Input() botAvatar: string = '';
  @Input() userName: string = 'You';
  @Input() botName: string = 'Monica';
  @Input() userInitial: string = 'Y';
  @Input() botInitial: string = 'M';
  @Input() placeholder: string = 'Ask me anything, press \'/\' for prompt';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() primaryColor: string = '#7c3aed';
  @Input() isOpen: boolean = false;
  @Input() visible: boolean = true;
  
  @Output() sendMessage = new EventEmitter<string>();
  @Output() addSkill = new EventEmitter<void>();
  @Output() toggleChat = new EventEmitter<boolean>();

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // La propiedad visible ahora está definida como un Input arriba
  public newMessage: string = '';
  public showEmojiPicker: boolean = false;
  public modelName: string = 'GPT-4';
  public isTyping: boolean = false;
  public lastUserMessage: string = 'top 3 must-see places in New York';
  public currentTime: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    // Set user initial from username if not provided
    if (!this.userInitial && this.userName) {
      this.userInitial = this.userName.charAt(0);
    }
    
    if (!this.botInitial && this.botName) {
      this.botInitial = this.botName.charAt(0);
    }
    
    if (this.messages.length === 0) {
      // Initialize with a sample message if no messages provided
      this.messages = [
        {
          id: 1,
          text: 'New York City, a vibrant metropolis filled with iconic landmarks, offers countless must-see attractions. Here are the top 3 must-see places:\n\n1. Statue of Liberty: An enduring symbol of freedom and democracy, the Statue of Liberty is located on Li',
          sender: 'bot',
          timestamp: new Date(),
          senderName: this.botName
        }
      ];
    }
    
    // Agregamos un listener para el evento resize para manejar cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Aseguramos que la ventana del chat esté correctamente oculta al inicio
    setTimeout(() => {
      const chatContainer = document.querySelector('.chatbot-container') as HTMLElement;
      if (chatContainer) {
        chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        chatContainer.style.zIndex = '9999';
      }
      
      // Inicializamos los estilos del wrapper
      const wrapper = document.querySelector('.chatbot-wrapper') as HTMLElement;
      if (wrapper) {
        wrapper.style.position = 'fixed';
        wrapper.style.zIndex = '9999';
        wrapper.style.display = 'block';
      }
      
      // Llamamos a handleResize para configurar correctamente al inicio
      this.handleResize();
      
      console.log('Chatbot initialized:', {
        isOpen: this.isOpen,
        containerDisplay: chatContainer?.style.display,
        wrapperZIndex: wrapper?.style.zIndex
      });
    }, 500);
  }
  
  ngOnDestroy(): void {
    // Limpiamos el event listener cuando el componente se destruye
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
  
  handleResize(): void {
    // Comprobamos si estamos en móvil
    const isMobile = window.innerWidth <= 768;
    
    // Ajustamos el contenedor del chat
    const wrapper = document.querySelector('.chatbot-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.position = 'fixed';
      wrapper.style.zIndex = '9999';
      wrapper.style.display = 'block';
      
      if (isMobile) {
        wrapper.style.bottom = '20';
        wrapper.style.right = '0';
        wrapper.style.width = '100%';
      } else {
        wrapper.style.bottom = '0px';
        wrapper.style.right = '20px';
        wrapper.style.width = 'auto';
      }
    }
    
    // Ajustamos el contenedor del chatbot
    const chatContainer = document.querySelector('.chatbot-container') as HTMLElement;
    if (chatContainer && this.isOpen) {
      chatContainer.style.display = 'flex';
      chatContainer.style.zIndex = '9999';
      chatContainer.style.flexDirection = 'row';
      
      if (isMobile) {
        chatContainer.style.position = 'fixed';
        chatContainer.style.width = '100vw';
        chatContainer.style.height = '90vh';
        chatContainer.style.bottom = '67px'; //'Aqui'
        chatContainer.style.right = '0';
        chatContainer.style.borderRadius = '12px 12px 0 0';
      } else {
        chatContainer.style.position = 'absolute';
        chatContainer.style.width = '450px';
        chatContainer.style.height = '650px';
        chatContainer.style.bottom = '70px';
        chatContainer.style.right = '0';
        chatContainer.style.borderRadius = '12px';
      }
      
      // Ajustamos el sidebar para que siempre esté en el lado derecho
      // Los estilos de tema oscuro/claro se aplican mediante las clases CSS
      const sidebar = document.querySelector('.chat-sidebar') as HTMLElement;
      if (sidebar && isMobile) {
        // En móviles, el sidebar podría tener otros ajustes
        sidebar.style.padding = '8px 0';
      }
      
      // Aseguramos que chat-main sea visible y tenga el tamaño correcto
      const chatMain = document.querySelector('.chat-main') as HTMLElement;
      if (chatMain) {
        chatMain.style.display = 'flex';
        chatMain.style.flexDirection = 'column';
        chatMain.style.flex = '1';
        chatMain.style.width = 'calc(100% - 20px)';
        chatMain.style.height = '100%';
        chatMain.style.overflow = 'hidden';
      }
      
      // Aseguramos que el contenido del chat sea visible
      const chatContent = document.querySelector('.chat-content') as HTMLElement;
      if (chatContent) {
        chatContent.style.display = 'flex';
        chatContent.style.flexDirection = 'column';
        chatContent.style.flex = '1';
        chatContent.style.overflow = 'hidden';
      }
      
      // Aseguramos que los mensajes sean visibles
      const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
      if (chatMessages) {
        chatMessages.style.flex = '1';
        chatMessages.style.overflowY = 'auto';
        chatMessages.style.padding = '16px';
        chatMessages.style.display = 'flex';
        chatMessages.style.flexDirection = 'column';
      }
      
      // Aseguramos que el footer sea visible
      const chatFooter = document.querySelector('.chat-footer') as HTMLElement;
      if (chatFooter) {
        chatFooter.style.display = 'flex';
        chatFooter.style.flexDirection = 'column';
        chatFooter.style.padding = '8px 16px 12px';
      }
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  onSendMessage(): void {
    if (!this.newMessage.trim()) return;

    // Save the current message as the last user message
    this.lastUserMessage = this.newMessage.trim();

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: this.messages.length + 1,
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: this.userName
    };
    
    this.messages.push(userMessage);
    
    // Emit the message for parent to handle
    this.sendMessage.emit(this.newMessage);
    
    // Clear input
    this.newMessage = '';
    
    // Optional: Show typing indicator
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      
      // Simulate bot response (in real application, this would come from the parent)
      if (this.messages[this.messages.length - 1].sender === 'user') {
        // Sample bot response
        const botMessage: ChatMessage = {
          id: this.messages.length + 1,
          text: 'I understand you\'re asking about "' + this.lastUserMessage + '". Let me think about that...',
          sender: 'bot',
          timestamp: new Date(),
          senderName: this.botName
        };
        
        this.messages.push(botMessage);
      }
    }, 1500);
  }

  onAddSkill(): void {
    this.addSkill.emit();
  }

  toggleChatWindow(): void {
    this.isOpen = !this.isOpen;
    this.toggleChat.emit(this.isOpen);
    
    // Aseguramos que cualquier ajuste de posición se actualice
    setTimeout(() => {
      // Si el chat está abierto, hacemos scroll al final y enfocamos el input
      if (this.isOpen) {
        this.scrollToBottom();
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
        
        // Aplicamos los estilos al contenedor cuando se abre
        this.handleResize();
        
        // Hack para forzar rerender en móvil
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          // Forzamos re-renderizado para móviles
          const chatContent = document.querySelector('.chat-content') as HTMLElement;
          if (chatContent) {
            // Forzar repintado del DOM
            chatContent.style.display = 'none';
            setTimeout(() => {
              chatContent.style.display = 'flex';
              chatContent.style.flexDirection = 'column';
              chatContent.style.flex = '1';
              chatContent.style.overflow = 'hidden';
              chatContent.style.width = '100%';
              chatContent.style.height = '100%';
              
              this.scrollToBottom();
            }, 50);
          }
        }
      }
      
      // Para depuración
      console.log('Chat window toggled, isOpen:', this.isOpen);
      
      // Forzamos un reajuste de los estilos de visualización para el chatContainer
      const chatContainer = document.querySelector('.chatbot-container') as HTMLElement;
      if (chatContainer) {
        chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) {
          chatContainer.style.flexDirection = 'row';
        }
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
    
    // Auto-resize textarea
    this.adjustTextareaHeight(event);
  }
  
  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }
}

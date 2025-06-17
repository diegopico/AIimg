import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ChatMessage } from '../components/chatbot/chat-message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private botName = 'AI Assistant';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatMessage> {
    // Por ahora, simulamos una respuesta del bot
    // En un entorno real, aquí se haría la llamada al backend
    const botResponse: ChatMessage = {
      id: Date.now(),
      text: this.generateBotResponse(message),
      sender: 'bot',
      timestamp: new Date(),
      senderName: this.botName
    };

    return of(botResponse);
  }

  private generateBotResponse(message: string): string {
    // Lógica simple de respuesta - en un entorno real esto vendría del backend
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return 'Hello! How can I help you today?';
    } else if (message.toLowerCase().includes('help')) {
      return 'I\'m here to help! What do you need assistance with?';
    } else if (message.toLowerCase().includes('bye')) {
      return 'Goodbye! Have a great day!';
    } else {
      return 'I understand you\'re trying to communicate with me. How can I assist you?';
    }
  }
} 
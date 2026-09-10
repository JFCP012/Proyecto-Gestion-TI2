import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${API_BASE_URL}/api/chat`;

  constructor(private http: HttpClient) { }

  enviarMensaje(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}

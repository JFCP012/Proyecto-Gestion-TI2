import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-asistente-virtual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistente-virtual.component.html',
  styleUrls: ['./asistente-virtual.component.css']
})
export class AsistenteVirtualComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private chatService = inject(ChatService);
  private location = inject(Location);
  private router = inject(Router);

  private readonly STORAGE_KEY = 'agroheno_asistente_chat_history';

  private readonly welcomeMessage: ChatMessage = {
    sender: 'bot',
    text: '¡Hola! 🌿 Soy el asistente virtual experto de Agroheno. Te asesoro en la compra del mejor heno para Equinos (caballos), Bovinos (vacas) y Ovinos (ovejas). ¿Para qué animal buscas heno hoy?',
    timestamp: new Date()
  };

  mensajeInput: string = '';
  historialMensajes: ChatMessage[] = [];

  // Estado reactivo con RxJS para manejar el indicador de "Cargando..."
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  public cargando$: Observable<boolean> = this.cargandoSubject.asObservable();

  ngOnInit(): void {
    this.cargarHistorialAlmacenado();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /**
   * Carga el historial desde el localStorage o establece el mensaje de bienvenida por defecto.
   */
  private cargarHistorialAlmacenado(): void {
    try {
      const guardado = localStorage.getItem(this.STORAGE_KEY);
      if (guardado) {
        const parsed: ChatMessage[] = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.historialMensajes = parsed.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          return;
        }
      }
    } catch (e) {
      console.error('Error cargando el historial guardado del chat:', e);
    }
    // Si no hay historial previo guardado, inicializamos con el mensaje de bienvenida
    this.historialMensajes = [{ ...this.welcomeMessage, timestamp: new Date() }];
    this.guardarHistorial();
  }

  /**
   * Guarda el estado actual del historial de chat en el localStorage.
   */
  private guardarHistorial(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.historialMensajes));
    } catch (e) {
      console.error('Error al guardar el historial en localStorage:', e);
    }
  }

  /**
   * Desplaza el scroll automáticamente al final del contenedor de chat.
   */
  scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Envía un mensaje ingresado por el usuario y procesa la respuesta con la API.
   */
  enviarMensaje(): void {
    const texto = this.mensajeInput.trim();
    if (!texto || this.cargandoSubject.getValue()) {
      return;
    }

    // Agregar mensaje del usuario al historial
    this.historialMensajes.push({
      sender: 'user',
      text: texto,
      timestamp: new Date()
    });

    this.guardarHistorial();
    this.mensajeInput = '';
    this.cargandoSubject.next(true);

    // Consumo del servicio mediante RxJS
    this.chatService.enviarMensaje(texto)
      .pipe(
        finalize(() => this.cargandoSubject.next(false))
      )
      .subscribe({
        next: (res) => {
          this.historialMensajes.push({
            sender: 'bot',
            text: res.response,
            timestamp: new Date()
          });
          this.guardarHistorial();
        },
        error: (err) => {
          console.error('Error enviando mensaje:', err);
          this.historialMensajes.push({
            sender: 'bot',
            text: '⚠️ Lo sentimos, hubo un problema al comunicarse con el servidor. Inténtalo de nuevo en un momento.',
            timestamp: new Date()
          });
          this.guardarHistorial();
        }
      });
  }

  /**
   * Envía rápidamente una sugerencia de los chips de la interfaz.
   */
  enviarSugerencia(sugerencia: string): void {
    this.mensajeInput = sugerencia;
    this.enviarMensaje();
  }

  /**
   * Limpia la pantalla y elimina el historial guardado en localStorage.
   */
  reiniciarConversacion(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Error al limpiar localStorage:', e);
    }
    this.historialMensajes = [{ ...this.welcomeMessage, timestamp: new Date() }];
    this.guardarHistorial();
  }

  /**
   * Regresa a la vista anterior usando Location o redirige al home.
   */
  regresar(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}

package com.HenoTrade.ventaHeno.Controller;

import com.HenoTrade.ventaHeno.dto.ChatRequestDTO;
import com.HenoTrade.ventaHeno.dto.ChatResponseDTO;
import com.HenoTrade.ventaHeno.service.GeminiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {


    private final GeminiChatService geminiChatService;

    @Autowired
    public ChatController(GeminiChatService geminiChatService) {
        this.geminiChatService = geminiChatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> responderMensaje(@RequestBody ChatRequestDTO request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponseDTO("El mensaje no puede estar vacío."));
        }

        String respuesta = geminiChatService.generarRespuesta(request.getMessage());
        return ResponseEntity.ok(new ChatResponseDTO(respuesta));
    }
}

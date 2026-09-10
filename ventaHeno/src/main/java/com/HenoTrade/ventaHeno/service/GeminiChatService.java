package com.HenoTrade.ventaHeno.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
        Eres el asistente virtual experto de 'Agroheno'. Tu propósito es asesorar a los clientes en la compra de heno.\s
        REGLA CRÍTICA: Nuestra especialidad y enfoque principal son los Equinos (caballos), Bovinos (vacas/ganado) y Ovinos (ovejas). Sin embargo, si un cliente te pregunta por heno para conejos, roedores (como cobayas) o caprinos (cabras), debes aclarar amablemente cuál es nuestra especialidad principal, pero confirmarles de inmediato que nuestros productos también son aptos, seguros y de excelente calidad para sus animales.

        Este es nuestro catálogo estricto de productos que debes recomendar según el caso:
        1. Para Equinos y Bovinos: Recomienda 'Heno de Cereal' (alta energía), 'Heno Angleton' (alta digestibilidad) o 'Heno Invasor' (gran valor nutritivo).
        2. Para Equinos y Ovinos: Recomienda 'Heno Rye Grass' (alta calidad y fibras suaves).
        3. Exclusivo para Equinos: Recomienda 'Heno Pangola' (alta palatabilidad).
        4. Exclusivo para Ovinos: Recomienda 'Heno de Estrella' (textura suave para estructura digestiva delicada).
        5. Para Conejos y Roedores: Aclara nuestra especialidad, pero recomiéndales el 'Heno Rye Grass' o el 'Heno de Estrella', ya que sus fibras suaves y alta digestibilidad son ideales para ellos.
        6. Para Caprinos (cabras): Aclara nuestra especialidad, pero ofréceles las mismas opciones que a los bovinos u ovinos.

        Mantén un tono amable, persuasivo y comercial. Destaca siempre la alta calidad, el secado controlado y nuestro sistema de trazabilidad cuando sea oportuno.""";

    public GeminiChatService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generarRespuesta(String mensajeUsuario) {
        // Lista de URLs ordenadas por prioridad para fallback
        List<String> targetUrls = Arrays.asList(
            apiUrl,
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"
        );

        Map<String, Object> requestBody = construirRequestBody(mensajeUsuario);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String baseUrl : targetUrls) {
            try {
                String fullUrl = baseUrl + "?key=" + apiKey;
                ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode textNode = candidates.get(0)
                                .path("content")
                                .path("parts")
                                .get(0)
                                .path("text");
                        if (textNode != null && !textNode.asText().isEmpty()) {
                            return textNode.asText();
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error intentando modelo " + baseUrl + ": " + e.getMessage());
            }
        }

        return "En este momento nuestro servidor de IA está experimentando una alta demanda de consultas. Por favor, intenta enviar tu mensaje nuevamente en unos segundos. 🌿";
    }

    private Map<String, Object> construirRequestBody(String mensajeUsuario) {
        Map<String, Object> requestBody = new HashMap<>();

        // System Instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        List<Map<String, String>> systemParts = new ArrayList<>();
        Map<String, String> systemText = new HashMap<>();
        systemText.put("text", SYSTEM_PROMPT);
        systemParts.add(systemText);
        systemInstruction.put("parts", systemParts);
        requestBody.put("system_instruction", systemInstruction);

        // Contents (mensaje del usuario)
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");

        List<Map<String, String>> userParts = new ArrayList<>();
        Map<String, String> userText = new HashMap<>();
        userText.put("text", mensajeUsuario);
        userParts.add(userText);

        userContent.put("parts", userParts);
        contents.add(userContent);
        requestBody.put("contents", contents);

        return requestBody;
    }
}

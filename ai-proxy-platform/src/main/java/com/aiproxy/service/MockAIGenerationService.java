package com.aiproxy.service;

import com.aiproxy.model.GenerationRequest;
import com.aiproxy.model.GenerationResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service("mockAIService")
public class MockAIGenerationService implements AIGenerationService {

    private static final List<String> RESPONSES = List.of(
            "La inteligencia artificial está transformando la industria al automatizar tareas repetitivas y permitir que los humanos se enfoquen en trabajo creativo y estratégico.",
            "Los modelos de lenguaje de gran escala aprenden patrones estadísticos en enormes corpus de texto, lo que les permite generar respuestas coherentes y contextualmente relevantes.",
            "El aprendizaje profundo ha revolucionado el procesamiento de imágenes, el reconocimiento de voz y la traducción automática, superando en muchos casos el rendimiento humano.",
            "La ética en la inteligencia artificial es fundamental: debemos garantizar que los sistemas sean transparentes, justos y no perpetúen sesgos presentes en los datos de entrenamiento.",
            "Las redes neuronales artificiales están inspiradas en el cerebro humano y son capaces de aprender representaciones jerárquicas de los datos para resolver problemas complejos."
    );

    private final Random random = new Random();

    @Override
    public GenerationResponse generate(GenerationRequest request) {
        long start = System.currentTimeMillis();

        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String generatedText = RESPONSES.get(random.nextInt(RESPONSES.size()));
        int tokensUsed = request.getPrompt().split(" ").length * 2 + (random.nextInt(151) + 50);

        return new GenerationResponse(
                request.getUserId(),
                generatedText,
                tokensUsed,
                System.currentTimeMillis() - start,
                LocalDateTime.now()
        );
    }
}

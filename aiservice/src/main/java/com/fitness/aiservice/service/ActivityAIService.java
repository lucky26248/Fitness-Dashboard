package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation (Activity activity){
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getRecommendations(prompt);
        log.info("RESPONSE FROM AI {} " , aiResponse);
        return processAIResponse(activity,aiResponse);
    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .path("text");

         String jsonContent = textNode.asText()
                 .replaceAll("\\n```","")
                 .trim();

         JsonNode analysisJson= mapper.readTree(jsonContent);
         JsonNode analysisNode = analysisJson.path("analysis");
         StringBuilder fullAnalysis = new StringBuilder();
         addAnalysisSection(fullAnalysis,analysisNode,"overall","Overall:");
         addAnalysisSection(fullAnalysis,analysisNode,"pace","Pace:");
         addAnalysisSection(fullAnalysis,analysisNode,"heartRate","Heart Rate:");


        List<String> improvements = extractImprovements(analysisJson.path("improvements"));
        List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
        List<String> safety = extractSafety(analysisJson.path("safety"));

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().toString())
                .recommendation(fullAnalysis.toString().trim())
                .improvements(improvements)
                .safety(safety)
                .suggestions(suggestions)
                .createdAt(LocalDateTime.now())
                .build();

        }catch(Exception e){
            e.printStackTrace();
            return createDefaultRecommendation(activity);

        }

    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().toString())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .suggestions(Collections.singletonList("Consider consulting a fitness consultant"))
                        .createdAt(LocalDateTime.now())
                        .build();

    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(item ->
                safety.add(item.asText()));

        }
        return safety .isEmpty() ?
                Collections.singletonList("Follow general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions .isEmpty() ?
                Collections.singletonList("No Specific suggestions Provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements .isEmpty() ?
                Collections.singletonList("No Specific improvement Provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity){
        return String.format("""
     Analyze this fitness activity and provide detailed recommendation in the  following EXACT JSON format:
     {
       "analysis":{
         "overall":"Overall analysis here",
         "pace":"Pace analysis here"
         "heartRate": "Heart rate analysis here"
       },
       
       "improvements":[
         {
         "area": "Area Name"
         "recommendation": "Detailed Recommendations"
         }
       ],
       "suggestions":[
       {
        "workout":"Workout Name"
        "description": "Detailed workout description"
        }
     ],
       "safety":[
       "Safety Point 1",
       "Safety Point 2"
     ]
    }
    
    Analyze this activity:
    Activity Type: %s
    Duration: %d minutes
    Calories Burned: %d
    Additional Metrics: %s
    
    
    Provide detailed analysis focusing on performance, improvements,next workout suggestions, and safety guidelines.
    Ensure the response follows the EXACT JSON format shown above.
    """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()

        );
    }


}

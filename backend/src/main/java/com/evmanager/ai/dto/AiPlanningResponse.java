package com.evmanager.ai.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiPlanningResponse {

    private String summary;
    private Map<String, Double> budgetBreakdown;
    private List<String> recommendedServices;
    private List<String> preparationMilestones;
    private List<String> dayOfTimeline;

    public AiPlanningResponse() {
        this.budgetBreakdown = new HashMap<>();
        this.recommendedServices = new ArrayList<>();
        this.preparationMilestones = new ArrayList<>();
        this.dayOfTimeline = new ArrayList<>();
    }

    public AiPlanningResponse(String summary,
                              Map<String, Double> budgetBreakdown,
                              List<String> recommendedServices,
                              List<String> preparationMilestones,
                              List<String> dayOfTimeline) {
        this.summary = summary;
        this.budgetBreakdown = budgetBreakdown != null ? budgetBreakdown : new HashMap<>();
        this.recommendedServices = recommendedServices != null ? recommendedServices : new ArrayList<>();
        this.preparationMilestones = preparationMilestones != null ? preparationMilestones : new ArrayList<>();
        this.dayOfTimeline = dayOfTimeline != null ? dayOfTimeline : new ArrayList<>();
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Map<String, Double> getBudgetBreakdown() {
        return budgetBreakdown;
    }

    public void setBudgetBreakdown(Map<String, Double> budgetBreakdown) {
        this.budgetBreakdown = budgetBreakdown;
    }

    public List<String> getRecommendedServices() {
        return recommendedServices;
    }

    public void setRecommendedServices(List<String> recommendedServices) {
        this.recommendedServices = recommendedServices;
    }

    public List<String> getPreparationMilestones() {
        return preparationMilestones;
    }

    public void setPreparationMilestones(List<String> preparationMilestones) {
        this.preparationMilestones = preparationMilestones;
    }

    public List<String> getDayOfTimeline() {
        return dayOfTimeline;
    }

    public void setDayOfTimeline(List<String> dayOfTimeline) {
        this.dayOfTimeline = dayOfTimeline;
    }
}

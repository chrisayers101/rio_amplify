<template>
  <div class="section-detail-view">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        ← Back to Overview
      </button>
      <h1>{{ section?.sectionName }}</h1>
    </div>

    <div v-if="section" class="detail-content">
      <!-- Section Summary -->
      <div class="section-summary">
        <div class="summary-card">
          <h3>Section Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Completion:</span>
              <span class="value">{{ section.percentComplete }}%</span>
            </div>
            <div class="summary-item">
              <span class="label">Status:</span>
              <span class="value">{{ section.statusOfCompleteness }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Quality:</span>
              <span class="value quality-badge" :class="getQualityClass(section.qualityRating)">
                {{ section.qualityRating }}
              </span>
            </div>
            <div class="summary-item">
              <span class="label">Issues:</span>
              <span class="value">{{ section.issues.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Observations:</span>
              <span class="value">{{ section.observations.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Sub-sections:</span>
              <span class="value">{{ section.subSections?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Content -->
      <div v-if="section.content" class="section-content">
        <div class="content-card">
          <h3>Section Content</h3>

          <!-- Executive Summary -->
          <div v-if="section.content.executiveSummary" class="content-section">
            <h4>Executive Summary</h4>
            <p class="content-text">{{ section.content.executiveSummary }}</p>
          </div>

          <!-- Key Recommendations -->
          <div v-if="section.content.keyRecommendations" class="content-section">
            <h4>Key Recommendations</h4>
            <ul class="recommendations-list">
              <li v-for="(recommendation, index) in section.content.keyRecommendations" :key="index" class="recommendation-item">
                {{ recommendation }}
              </li>
            </ul>
          </div>

          <!-- Economic Highlights -->
          <div v-if="section.content.economicHighlights" class="content-section">
            <h4>Economic Highlights</h4>
            <p class="content-text">{{ section.content.economicHighlights }}</p>
          </div>

          <!-- Risk Assessment -->
          <div v-if="section.content.riskAssessment" class="content-section">
            <h4>Risk Assessment</h4>
            <p class="content-text">{{ section.content.riskAssessment }}</p>
          </div>

          <!-- Strategic Overview -->
          <div v-if="section.content.strategicOverview" class="content-section">
            <h4>Strategic Overview</h4>
            <p class="content-text">{{ section.content.strategicOverview }}</p>
          </div>

          <!-- Market Positioning -->
          <div v-if="section.content.marketPositioning" class="content-section">
            <h4>Market Positioning</h4>
            <p class="content-text">{{ section.content.marketPositioning }}</p>
          </div>

          <!-- Competitive Advantages -->
          <div v-if="section.content.competitiveAdvantages" class="content-section">
            <h4>Competitive Advantages</h4>
            <ul class="advantages-list">
              <li v-for="(advantage, index) in section.content.competitiveAdvantages" :key="index" class="advantage-item">
                {{ advantage }}
              </li>
            </ul>
          </div>

          <!-- Value Proposition -->
          <div v-if="section.content.valueProposition" class="content-section">
            <h4>Value Proposition</h4>
            <p class="content-text">{{ section.content.valueProposition }}</p>
          </div>

          <!-- Stakeholder Engagement -->
          <div v-if="section.content.stakeholderEngagement" class="content-section">
            <h4>Stakeholder Engagement</h4>
            <p class="content-text">{{ section.content.stakeholderEngagement }}</p>
          </div>

          <!-- Sustainability Strategy -->
          <div v-if="section.content.sustainabilityStrategy" class="content-section">
            <h4>Sustainability Strategy</h4>
            <p class="content-text">{{ section.content.sustainabilityStrategy }}</p>
          </div>

          <!-- Risk Management -->
          <div v-if="section.content.riskManagement" class="content-section">
            <h4>Risk Management</h4>
            <p class="content-text">{{ section.content.riskManagement }}</p>
          </div>

          <!-- Performance Metrics -->
          <div v-if="section.content.performanceMetrics" class="content-section">
            <h4>Performance Metrics</h4>
            <p class="content-text">{{ section.content.performanceMetrics }}</p>
          </div>

          <!-- Market Overview -->
          <div v-if="section.content.marketOverview" class="content-section">
            <h4>Market Overview</h4>
            <p class="content-text">{{ section.content.marketOverview }}</p>
          </div>

          <!-- Demand Analysis -->
          <div v-if="section.content.demandAnalysis" class="content-section">
            <h4>Demand Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.demandAnalysis.globalDemand" class="analysis-item">
                <strong>Global Demand:</strong> {{ section.content.demandAnalysis.globalDemand }}
              </div>
              <div v-if="section.content.demandAnalysis.regionalDemand" class="analysis-item">
                <strong>Regional Demand:</strong> {{ section.content.demandAnalysis.regionalDemand }}
              </div>
              <div v-if="section.content.demandAnalysis.growthDrivers" class="analysis-item">
                <strong>Growth Drivers:</strong> {{ section.content.demandAnalysis.growthDrivers }}
              </div>
            </div>
          </div>

          <!-- Supply Analysis -->
          <div v-if="section.content.supplyAnalysis" class="content-section">
            <h4>Supply Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.supplyAnalysis.globalSupply" class="analysis-item">
                <strong>Global Supply:</strong> {{ section.content.supplyAnalysis.globalSupply }}
              </div>
              <div v-if="section.content.supplyAnalysis.supplyConstraints" class="analysis-item">
                <strong>Supply Constraints:</strong> {{ section.content.supplyAnalysis.supplyConstraints }}
              </div>
              <div v-if="section.content.supplyAnalysis.qualityFactors" class="analysis-item">
                <strong>Quality Factors:</strong> {{ section.content.supplyAnalysis.qualityFactors }}
              </div>
            </div>
          </div>

          <!-- Customer Segmentation -->
          <div v-if="section.content.customerSegmentation" class="content-section">
            <h4>Customer Segmentation</h4>
            <div class="analysis-grid">
              <div v-if="section.content.customerSegmentation.primaryCustomers" class="analysis-item">
                <strong>Primary Customers:</strong> {{ section.content.customerSegmentation.primaryCustomers }}
              </div>
              <div v-if="section.content.customerSegmentation.secondaryCustomers" class="analysis-item">
                <strong>Secondary Customers:</strong> {{ section.content.customerSegmentation.secondaryCustomers }}
              </div>
              <div v-if="section.content.customerSegmentation.customerRequirements" class="analysis-item">
                <strong>Customer Requirements:</strong> {{ section.content.customerSegmentation.customerRequirements }}
              </div>
            </div>
          </div>

          <!-- Pricing Strategy -->
          <div v-if="section.content.pricingStrategy" class="content-section">
            <h4>Pricing Strategy</h4>
            <div class="analysis-grid">
              <div v-if="section.content.pricingStrategy.basePrice" class="analysis-item">
                <strong>Base Price:</strong> {{ section.content.pricingStrategy.basePrice }}
              </div>
              <div v-if="section.content.pricingStrategy.qualityPremiums" class="analysis-item">
                <strong>Quality Premiums:</strong> {{ section.content.pricingStrategy.qualityPremiums }}
              </div>
              <div v-if="section.content.pricingStrategy.volumeDiscounts" class="analysis-item">
                <strong>Volume Discounts:</strong> {{ section.content.pricingStrategy.volumeDiscounts }}
              </div>
              <div v-if="section.content.pricingStrategy.priceEscalation" class="analysis-item">
                <strong>Price Escalation:</strong> {{ section.content.pricingStrategy.priceEscalation }}
              </div>
            </div>
          </div>

          <!-- Sales Strategy -->
          <div v-if="section.content.salesStrategy" class="content-section">
            <h4>Sales Strategy</h4>
            <div class="analysis-grid">
              <div v-if="section.content.salesStrategy.distributionChannels" class="analysis-item">
                <strong>Distribution Channels:</strong> {{ section.content.salesStrategy.distributionChannels }}
              </div>
              <div v-if="section.content.salesStrategy.contractTerms" class="analysis-item">
                <strong>Contract Terms:</strong> {{ section.content.salesStrategy.contractTerms }}
              </div>
              <div v-if="section.content.salesStrategy.customerService" class="analysis-item">
                <strong>Customer Service:</strong> {{ section.content.salesStrategy.customerService }}
              </div>
              <div v-if="section.content.salesStrategy.logistics" class="analysis-item">
                <strong>Logistics:</strong> {{ section.content.salesStrategy.logistics }}
              </div>
            </div>
          </div>

          <!-- Competitive Analysis -->
          <div v-if="section.content.competitiveAnalysis" class="content-section">
            <h4>Competitive Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.competitiveAnalysis.majorCompetitors" class="analysis-item">
                <strong>Major Competitors:</strong> {{ section.content.competitiveAnalysis.majorCompetitors }}
              </div>
              <div v-if="section.content.competitiveAnalysis.competitivePosition" class="analysis-item">
                <strong>Competitive Position:</strong> {{ section.content.competitiveAnalysis.competitivePosition }}
              </div>
              <div v-if="section.content.competitiveAnalysis.differentiation" class="analysis-item">
                <strong>Differentiation:</strong> {{ section.content.competitiveAnalysis.differentiation }}
              </div>
            </div>
          </div>

          <!-- Market Risks -->
          <div v-if="section.content.marketRisks" class="content-section">
            <h4>Market Risks</h4>
            <div class="analysis-grid">
              <div v-if="section.content.marketRisks.demandRisks" class="analysis-item">
                <strong>Demand Risks:</strong> {{ section.content.marketRisks.demandRisks }}
              </div>
              <div v-if="section.content.marketRisks.supplyRisks" class="analysis-item">
                <strong>Supply Risks:</strong> {{ section.content.marketRisks.supplyRisks }}
              </div>
              <div v-if="section.content.marketRisks.priceRisks" class="analysis-item">
                <strong>Price Risks:</strong> {{ section.content.marketRisks.priceRisks }}
              </div>
            </div>
          </div>

          <!-- Marketing Plan -->
          <div v-if="section.content.marketingPlan" class="content-section">
            <h4>Marketing Plan</h4>
            <div class="analysis-grid">
              <div v-if="section.content.marketingPlan.targetMarkets" class="analysis-item">
                <strong>Target Markets:</strong> {{ section.content.marketingPlan.targetMarkets }}
              </div>
              <div v-if="section.content.marketingPlan.promotionalActivities" class="analysis-item">
                <strong>Promotional Activities:</strong> {{ section.content.marketingPlan.promotionalActivities }}
              </div>
              <div v-if="section.content.marketingPlan.brandPositioning" class="analysis-item">
                <strong>Brand Positioning:</strong> {{ section.content.marketingPlan.brandPositioning }}
              </div>
              <div v-if="section.content.marketingPlan.customerRetention" class="analysis-item">
                <strong>Customer Retention:</strong> {{ section.content.marketingPlan.customerRetention }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Content -->
      <div v-if="section.content" class="section-content">
        <div class="content-card">
          <h3>Section Content</h3>

          <!-- Executive Summary -->
          <div v-if="section.content.executiveSummary" class="content-section">
            <h4>Executive Summary</h4>
            <p class="content-text">{{ section.content.executiveSummary }}</p>
          </div>

          <!-- Key Recommendations -->
          <div v-if="section.content.keyRecommendations" class="content-section">
            <h4>Key Recommendations</h4>
            <ul class="recommendations-list">
              <li v-for="(recommendation, index) in section.content.keyRecommendations" :key="index" class="recommendation-item">
                {{ recommendation }}
              </li>
            </ul>
          </div>

          <!-- Economic Highlights -->
          <div v-if="section.content.economicHighlights" class="content-section">
            <h4>Economic Highlights</h4>
            <p class="content-text">{{ section.content.economicHighlights }}</p>
          </div>

          <!-- Risk Assessment -->
          <div v-if="section.content.riskAssessment" class="content-section">
            <h4>Risk Assessment</h4>
            <p class="content-text">{{ section.content.riskAssessment }}</p>
          </div>

          <!-- Strategic Overview -->
          <div v-if="section.content.strategicOverview" class="content-section">
            <h4>Strategic Overview</h4>
            <p class="content-text">{{ section.content.strategicOverview }}</p>
          </div>

          <!-- Market Positioning -->
          <div v-if="section.content.marketPositioning" class="content-section">
            <h4>Market Positioning</h4>
            <p class="content-text">{{ section.content.marketPositioning }}</p>
          </div>

          <!-- Competitive Advantages -->
          <div v-if="section.content.competitiveAdvantages" class="content-section">
            <h4>Competitive Advantages</h4>
            <ul class="advantages-list">
              <li v-for="(advantage, index) in section.content.competitiveAdvantages" :key="index" class="advantage-item">
                {{ advantage }}
              </li>
            </ul>
          </div>

          <!-- Value Proposition -->
          <div v-if="section.content.valueProposition" class="content-section">
            <h4>Value Proposition</h4>
            <p class="content-text">{{ section.content.valueProposition }}</p>
          </div>

          <!-- Stakeholder Engagement -->
          <div v-if="section.content.stakeholderEngagement" class="content-section">
            <h4>Stakeholder Engagement</h4>
            <p class="content-text">{{ section.content.stakeholderEngagement }}</p>
          </div>

          <!-- Sustainability Strategy -->
          <div v-if="section.content.sustainabilityStrategy" class="content-section">
            <h4>Sustainability Strategy</h4>
            <p class="content-text">{{ section.content.sustainabilityStrategy }}</p>
          </div>

          <!-- Risk Management -->
          <div v-if="section.content.riskManagement" class="content-section">
            <h4>Risk Management</h4>
            <p class="content-text">{{ section.content.riskManagement }}</p>
          </div>

          <!-- Performance Metrics -->
          <div v-if="section.content.performanceMetrics" class="content-section">
            <h4>Performance Metrics</h4>
            <p class="content-text">{{ section.content.performanceMetrics }}</p>
          </div>

          <!-- Market Overview -->
          <div v-if="section.content.marketOverview" class="content-section">
            <h4>Market Overview</h4>
            <p class="content-text">{{ section.content.marketOverview }}</p>
          </div>

          <!-- Demand Analysis -->
          <div v-if="section.content.demandAnalysis" class="content-section">
            <h4>Demand Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.demandAnalysis.globalDemand" class="analysis-item">
                <strong>Global Demand:</strong> {{ section.content.demandAnalysis.globalDemand }}
              </div>
              <div v-if="section.content.demandAnalysis.regionalDemand" class="analysis-item">
                <strong>Regional Demand:</strong> {{ section.content.demandAnalysis.regionalDemand }}
              </div>
              <div v-if="section.content.demandAnalysis.growthDrivers" class="analysis-item">
                <strong>Growth Drivers:</strong> {{ section.content.demandAnalysis.growthDrivers }}
              </div>
            </div>
          </div>

          <!-- Supply Analysis -->
          <div v-if="section.content.supplyAnalysis" class="content-section">
            <h4>Supply Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.supplyAnalysis.globalSupply" class="analysis-item">
                <strong>Global Supply:</strong> {{ section.content.supplyAnalysis.globalSupply }}
              </div>
              <div v-if="section.content.supplyAnalysis.supplyConstraints" class="analysis-item">
                <strong>Supply Constraints:</strong> {{ section.content.supplyAnalysis.supplyConstraints }}
              </div>
              <div v-if="section.content.supplyAnalysis.qualityFactors" class="analysis-item">
                <strong>Quality Factors:</strong> {{ section.content.supplyAnalysis.qualityFactors }}
              </div>
            </div>
          </div>

          <!-- Customer Segmentation -->
          <div v-if="section.content.customerSegmentation" class="content-section">
            <h4>Customer Segmentation</h4>
            <div class="analysis-grid">
              <div v-if="section.content.customerSegmentation.primaryCustomers" class="analysis-item">
                <strong>Primary Customers:</strong> {{ section.content.customerSegmentation.primaryCustomers }}
              </div>
              <div v-if="section.content.customerSegmentation.secondaryCustomers" class="analysis-item">
                <strong>Secondary Customers:</strong> {{ section.content.customerSegmentation.secondaryCustomers }}
              </div>
              <div v-if="section.content.customerSegmentation.customerRequirements" class="analysis-item">
                <strong>Customer Requirements:</strong> {{ section.content.customerSegmentation.customerRequirements }}
              </div>
            </div>
          </div>

          <!-- Pricing Strategy -->
          <div v-if="section.content.pricingStrategy" class="content-section">
            <h4>Pricing Strategy</h4>
            <div class="analysis-grid">
              <div v-if="section.content.pricingStrategy.basePrice" class="analysis-item">
                <strong>Base Price:</strong> {{ section.content.pricingStrategy.basePrice }}
              </div>
              <div v-if="section.content.pricingStrategy.qualityPremiums" class="analysis-item">
                <strong>Quality Premiums:</strong> {{ section.content.pricingStrategy.qualityPremiums }}
              </div>
              <div v-if="section.content.pricingStrategy.volumeDiscounts" class="analysis-item">
                <strong>Volume Discounts:</strong> {{ section.content.pricingStrategy.volumeDiscounts }}
              </div>
              <div v-if="section.content.pricingStrategy.priceEscalation" class="analysis-item">
                <strong>Price Escalation:</strong> {{ section.content.pricingStrategy.priceEscalation }}
              </div>
            </div>
          </div>

          <!-- Sales Strategy -->
          <div v-if="section.content.salesStrategy" class="content-section">
            <h4>Sales Strategy</h4>
            <div class="analysis-grid">
              <div v-if="section.content.salesStrategy.distributionChannels" class="analysis-item">
                <strong>Distribution Channels:</strong> {{ section.content.salesStrategy.distributionChannels }}
              </div>
              <div v-if="section.content.salesStrategy.contractTerms" class="analysis-item">
                <strong>Contract Terms:</strong> {{ section.content.salesStrategy.contractTerms }}
              </div>
              <div v-if="section.content.salesStrategy.customerService" class="analysis-item">
                <strong>Customer Service:</strong> {{ section.content.salesStrategy.customerService }}
              </div>
              <div v-if="section.content.salesStrategy.logistics" class="analysis-item">
                <strong>Logistics:</strong> {{ section.content.salesStrategy.logistics }}
              </div>
            </div>
          </div>

          <!-- Competitive Analysis -->
          <div v-if="section.content.competitiveAnalysis" class="content-section">
            <h4>Competitive Analysis</h4>
            <div class="analysis-grid">
              <div v-if="section.content.competitiveAnalysis.majorCompetitors" class="analysis-item">
                <strong>Major Competitors:</strong> {{ section.content.competitiveAnalysis.majorCompetitors }}
              </div>
              <div v-if="section.content.competitiveAnalysis.competitivePosition" class="analysis-item">
                <strong>Competitive Position:</strong> {{ section.content.competitiveAnalysis.competitivePosition }}
              </div>
              <div v-if="section.content.competitiveAnalysis.differentiation" class="analysis-item">
                <strong>Differentiation:</strong> {{ section.content.competitiveAnalysis.differentiation }}
              </div>
            </div>
          </div>

          <!-- Market Risks -->
          <div v-if="section.content.marketRisks" class="content-section">
            <h4>Market Risks</h4>
            <div class="analysis-grid">
              <div v-if="section.content.marketRisks.demandRisks" class="analysis-item">
                <strong>Demand Risks:</strong> {{ section.content.marketRisks.demandRisks }}
              </div>
              <div v-if="section.content.marketRisks.supplyRisks" class="analysis-item">
                <strong>Supply Risks:</strong> {{ section.content.marketRisks.supplyRisks }}
              </div>
              <div v-if="section.content.marketRisks.priceRisks" class="analysis-item">
                <strong>Price Risks:</strong> {{ section.content.marketRisks.priceRisks }}
              </div>
            </div>
          </div>

          <!-- Marketing Plan -->
          <div v-if="section.content.marketingPlan" class="content-section">
            <h4>Marketing Plan</h4>
            <div class="analysis-grid">
              <div v-if="section.content.marketingPlan.targetMarkets" class="analysis-item">
                <strong>Target Markets:</strong> {{ section.content.marketingPlan.targetMarkets }}
              </div>
              <div v-if="section.content.marketingPlan.promotionalActivities" class="analysis-item">
                <strong>Promotional Activities:</strong> {{ section.content.marketingPlan.promotionalActivities }}
              </div>
              <div v-if="section.content.marketingPlan.brandPositioning" class="analysis-item">
                <strong>Brand Positioning:</strong> {{ section.content.marketingPlan.brandPositioning }}
              </div>
              <div v-if="section.content.marketingPlan.customerRetention" class="analysis-item">
                <strong>Customer Retention:</strong> {{ section.content.marketingPlan.customerRetention }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub-sections -->
      <div v-if="section.subSections && section.subSections.length > 0" class="sub-sections">
        <h3>Sub-sections ({{ section.subSections.length }})</h3>
        <div class="sub-sections-grid">
          <div v-for="subSection in section.subSections" :key="subSection.subSectionId" class="sub-section-card">
            <div class="sub-section-header">
              <h4>{{ subSection.subSectionTitle }}</h4>
              <div class="sub-section-meta">
                <span class="completion">{{ subSection.percentComplete }}%</span>
                <span class="quality-badge" :class="getQualityClass(subSection.assessment.quality)">
                  {{ subSection.assessment.quality }}
                </span>
              </div>
            </div>

            <!-- Sub-section Content -->
            <div v-if="subSection.content" class="sub-section-content">
              <div v-if="subSection.content.overview" class="content-section">
                <h5>Overview</h5>
                <p class="content-text">{{ subSection.content.overview }}</p>
              </div>

              <div v-if="subSection.content.projectScope" class="content-section">
                <h5>Project Scope</h5>
                <p class="content-text">{{ subSection.content.projectScope }}</p>
              </div>

              <div v-if="subSection.content.economicSummary" class="content-section">
                <h5>Economic Summary</h5>
                <p class="content-text">{{ subSection.content.economicSummary }}</p>
              </div>

              <div v-if="subSection.content.timeline" class="content-section">
                <h5>Timeline</h5>
                <p class="content-text">{{ subSection.content.timeline }}</p>
              </div>

              <div v-if="subSection.content.stakeholderBenefits" class="content-section">
                <h5>Stakeholder Benefits</h5>
                <p class="content-text">{{ subSection.content.stakeholderBenefits }}</p>
              </div>

              <div v-if="subSection.content.totalCapitalCost" class="content-section">
                <h5>Capital Costs</h5>
                <div class="cost-breakdown">
                  <div class="cost-item">
                    <strong>Total Capital Cost:</strong> {{ subSection.content.totalCapitalCost }}
                  </div>
                  <div v-if="subSection.content.costBreakdown" class="cost-breakdown-grid">
                    <div v-for="(cost, key) in subSection.content.costBreakdown" :key="key" class="cost-breakdown-item">
                      <strong>{{ key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}:</strong> {{ cost }}
                    </div>
                  </div>
                  <div v-if="subSection.content.fundingStructure" class="cost-item">
                    <strong>Funding Structure:</strong> {{ subSection.content.fundingStructure }}
                  </div>
                  <div v-if="subSection.content.costAssumptions" class="cost-item">
                    <strong>Cost Assumptions:</strong> {{ subSection.content.costAssumptions }}
                  </div>
                  <div v-if="subSection.content.sensitivityAnalysis" class="cost-item">
                    <strong>Sensitivity Analysis:</strong> {{ subSection.content.sensitivityAnalysis }}
                  </div>
                </div>
              </div>

              <div v-if="subSection.content.financialMetrics" class="content-section">
                <h5>Financial Metrics</h5>
                <div class="metrics-grid">
                  <div v-for="(metric, key) in subSection.content.financialMetrics" :key="key" class="metric-item">
                    <strong>{{ key.toUpperCase() }}:</strong> {{ metric }}
                  </div>
                </div>
                <div v-if="subSection.content.cashFlowProjection" class="cash-flow">
                  <strong>Cash Flow Projection:</strong> {{ subSection.content.cashFlowProjection }}
                </div>
                <div v-if="subSection.content.marketAssumptions" class="market-assumptions">
                  <strong>Market Assumptions:</strong> {{ subSection.content.marketAssumptions }}
                </div>
                <div v-if="subSection.content.economicConclusion" class="economic-conclusion">
                  <strong>Economic Conclusion:</strong> {{ subSection.content.economicConclusion }}
                </div>
              </div>
            </div>

            <!-- Assessment Details -->
            <div class="assessment-details">
              <div class="assessment-grid">
                <div class="assessment-item">
                  <span class="label">Consistency:</span>
                  <span class="value">{{ subSection.assessment.consistency }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Contradictions:</span>
                  <span class="value">{{ subSection.assessment.contradictions }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Gaps:</span>
                  <span class="value">{{ subSection.assessment.gaps }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Guideline:</span>
                  <span class="value">{{ subSection.assessment.guidelineReference }}</span>
                </div>
              </div>
            </div>

            <!-- Sub-section Observations -->
            <div v-if="subSection.observations && subSection.observations.length > 0" class="sub-observations">
              <h5>Observations ({{ subSection.observations.length }})</h5>
              <div class="observations-list">
                <div v-for="(observation, index) in subSection.observations" :key="index" class="observation-item">
                  <div class="observation-header">
                    <span class="observation-change" :class="{ 'changed': observation.changeDetected }">
                      {{ observation.changeDetected ? 'Changed' : 'No Change' }}
                    </span>
                  </div>
                  <p class="observation-text">{{ observation.note }}</p>
                  <p class="observation-source">Source: {{ observation.source }}</p>
                </div>
              </div>
            </div>

            <!-- Sub-section Decisions -->
            <div v-if="subSection.decisions && subSection.decisions.length > 0" class="sub-decisions">
              <h5>Decisions ({{ subSection.decisions.length }})</h5>
              <div class="decisions-list">
                <div v-for="(decision, index) in subSection.decisions" :key="index" class="decision-item">
                  <div class="decision-header">
                    <span class="decision-date">{{ formatDate(decision.date) }}</span>
                  </div>
                  <div class="decision-content">
                    <div class="decision-original">
                      <strong>Original:</strong> {{ decision.original }}
                    </div>
                    <div class="decision-revised">
                      <strong>Revised:</strong> {{ decision.revised }}
                    </div>
                    <div class="decision-reason">
                      <strong>Reason:</strong> {{ decision.reason }}
                    </div>
                  </div>
                  <p class="decision-source">Source: {{ decision.source }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Section Issues -->
      <div v-if="section.issues && section.issues.length > 0" class="section-issues">
        <h3>Issues ({{ section.issues.length }})</h3>
        <div class="issues-list">
          <div v-for="issue in section.issues" :key="issue.id" class="issue-item">
            <div class="issue-header">
              <span class="issue-id">{{ issue.id }}</span>
              <span class="issue-status" :class="getStatusClass(issue.status)">
                {{ issue.status }}
              </span>
            </div>
            <p class="issue-description">{{ issue.description }}</p>
            <p class="issue-source">Source: {{ issue.source }}</p>
          </div>
        </div>
      </div>

      <!-- Main Section Observations -->
      <div v-if="section.observations && section.observations.length > 0" class="section-observations">
        <h3>Observations ({{ section.observations.length }})</h3>
        <div class="observations-list">
          <div v-for="observation in section.observations" :key="observation.id" class="observation-item">
            <div class="observation-header">
              <span class="observation-id">{{ observation.id }}</span>
              <span class="observation-change" :class="{ 'changed': observation.changeOccurred }">
                {{ observation.changeOccurred ? 'Changed' : 'No Change' }}
              </span>
            </div>
            <p class="observation-text">{{ observation.text }}</p>
            <p class="observation-source">Source: {{ observation.source }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading section details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import feasibilityData from '@/data/feasibility_scaffold_full.json'

interface SubSection {
  subSectionId: string
  subSectionTitle: string
  percentComplete: number
  assessment: {
    quality: string
    consistency: string
    contradictions: string
    gaps: string
    guidelineReference: string
  }
  content?: {
    overview?: string
    projectScope?: string
    economicSummary?: string
    timeline?: string
    stakeholderBenefits?: string
    totalCapitalCost?: string
    costBreakdown?: Record<string, string>
    fundingStructure?: string
    costAssumptions?: string
    sensitivityAnalysis?: string
    financialMetrics?: Record<string, string>
    cashFlowProjection?: string
    marketAssumptions?: string
    economicConclusion?: string
  }
  observations: Array<{
    note: string
    source: string
    changeDetected: boolean
  }>
  decisions: Array<{
    date: string
    original: string
    revised: string
    reason: string
    source: string
  }>
}

interface Section {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  content?: {
    executiveSummary?: string
    keyRecommendations?: string[]
    economicHighlights?: string
    riskAssessment?: string
    strategicOverview?: string
    marketPositioning?: string
    competitiveAdvantages?: string[]
    valueProposition?: string
    stakeholderEngagement?: string
    sustainabilityStrategy?: string
    riskManagement?: string
    performanceMetrics?: string
    marketOverview?: string
    demandAnalysis?: {
      globalDemand?: string
      regionalDemand?: string
      growthDrivers?: string
    }
    supplyAnalysis?: {
      globalSupply?: string
      supplyConstraints?: string
      qualityFactors?: string
    }
    customerSegmentation?: {
      primaryCustomers?: string
      secondaryCustomers?: string
      customerRequirements?: string
    }
    pricingStrategy?: {
      basePrice?: string
      qualityPremiums?: string
      volumeDiscounts?: string
      priceEscalation?: string
    }
    salesStrategy?: {
      distributionChannels?: string
      contractTerms?: string
      customerService?: string
      logistics?: string
    }
    competitiveAnalysis?: {
      majorCompetitors?: string
      competitivePosition?: string
      differentiation?: string
    }
    marketRisks?: {
      demandRisks?: string
      supplyRisks?: string
      priceRisks?: string
    }
    marketingPlan?: {
      targetMarkets?: string
      promotionalActivities?: string
      brandPositioning?: string
      customerRetention?: string
    }
  }
  issues: Array<{
    id: string
    description: string
    status: string
    source: string
  }>
  observations: Array<{
    id: string
    text: string
    source: string
    changeOccurred: boolean
  }>
  subSections?: SubSection[]
}

const route = useRoute()
const section = ref<Section | null>(null)

onMounted(() => {
  const sectionId = route.params.sectionId as string
  console.log('Loading section:', sectionId)

  // Load section data from the JSON file
  const sections = feasibilityData.feasibilityStudyView.sections
  const foundSection = sections.find(s => s.sectionId === sectionId)

  if (foundSection) {
    section.value = foundSection
    console.log('Loaded section:', foundSection)
  } else {
    console.error('Section not found:', sectionId)
  }
})

const getQualityClass = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'high':
      return 'quality-high'
    case 'good':
      return 'quality-good'
    case 'moderate':
      return 'quality-moderate'
    case 'low':
      return 'quality-low'
    default:
      return 'quality-unknown'
  }
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'status-resolved'
    case 'open':
      return 'status-open'
    case 'in progress':
      return 'status-in-progress'
    default:
      return 'status-unknown'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.section-detail-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #e5e7eb;
}

.detail-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.section-summary {
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.summary-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.summary-item .label {
  font-weight: 500;
  color: #6b7280;
}

.summary-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

.quality-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.quality-high {
  background: #dcfce7;
  color: #166534;
}

.quality-good {
  background: #fef3c7;
  color: #92400e;
}

.quality-moderate {
  background: #ede9fe;
  color: #5b21b6;
}

.quality-low {
  background: #fee2e2;
  color: #991b1b;
}

.quality-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* Section Content */
.section-content {
  margin-bottom: 32px;
}

.content-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.content-card h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.content-section h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.content-text {
  line-height: 1.6;
  color: #374151;
  margin: 0 0 12px 0;
}

.recommendations-list,
.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendation-item,
.advantage-item {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  line-height: 1.5;
  color: #374151;
}

.recommendation-item:last-child,
.advantage-item:last-child {
  border-bottom: none;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.analysis-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  line-height: 1.5;
  color: #374151;
}

.cost-breakdown {
  margin-top: 12px;
}

.cost-item {
  padding: 8px 0;
  line-height: 1.5;
  color: #374151;
}

.cost-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin: 12px 0;
}

.cost-breakdown-item {
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.metric-item {
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
}

.cash-flow,
.market-assumptions,
.economic-conclusion {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  line-height: 1.5;
  color: #374151;
}

/* Sub-sections */
.sub-sections {
  margin-bottom: 32px;
}

.sub-sections h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.sub-sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.sub-section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.sub-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sub-section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.sub-section-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sub-section-meta .completion {
  font-weight: 600;
  color: #059669;
}

.sub-section-content {
  margin-bottom: 16px;
}

.assessment-details {
  margin-bottom: 16px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.assessment-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.assessment-item .label {
  color: #6b7280;
  font-weight: 500;
}

.assessment-item .value {
  color: #1a1a1a;
  font-weight: 600;
}

.sub-observations,
.sub-decisions {
  margin-top: 16px;
}

.sub-observations h5,
.sub-decisions h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.observations-list,
.decisions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.observation-item,
.decision-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #e5e7eb;
}

.observation-header,
.decision-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.observation-id,
.decision-date {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.observation-change {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: #f3f4f6;
  color: #6b7280;
}

.observation-change.changed {
  background: #fee2e2;
  color: #991b1b;
}

.observation-text,
.decision-content {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #374151;
}

.observation-source,
.decision-source {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.decision-original,
.decision-revised,
.decision-reason {
  margin-bottom: 4px;
  line-height: 1.4;
}

/* Section Issues */
.section-issues {
  margin-bottom: 32px;
}

.section-issues h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-id {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.issue-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-resolved {
  background: #dcfce7;
  color: #166534;
}

.status-open {
  background: #fee2e2;
  color: #991b1b;
}

.status-in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

.issue-description {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #374151;
}

.issue-source {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* Section Observations */
.section-observations {
  margin-bottom: 32px;
}

.section-observations h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

/* Section Content Styles */
.section-content {
  margin-bottom: 32px;
}

.content-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.content-card h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.content-text {
  line-height: 1.6;
  color: #374151;
  margin: 0 0 12px 0;
}

.recommendations-list,
.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendation-item,
.advantage-item {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  line-height: 1.5;
  color: #374151;
}

.recommendation-item:last-child,
.advantage-item:last-child {
  border-bottom: none;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.analysis-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  line-height: 1.5;
  color: #374151;
}

/* Sub-section Content Styles */
.sub-section-content {
  margin-bottom: 16px;
}

.sub-section-content h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.cost-breakdown {
  margin-top: 12px;
}

.cost-item {
  padding: 8px 0;
  line-height: 1.5;
  color: #374151;
}

.cost-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin: 12px 0;
}

.cost-breakdown-item {
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.metric-item {
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
}

.cash-flow,
.market-assumptions,
.economic-conclusion {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  line-height: 1.5;
  color: #374151;
}
</style>

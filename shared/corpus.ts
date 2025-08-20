// ============================================================================
// FEASIBILITY STUDY CORPUS DATA
// ============================================================================
// This file contains the markdown content for each section of the feasibility study
// Import and use: import { feasibilityStudyCorpus } from '@shared/corpus'

export interface CorpusSection {
  sectionName: string
  content: string
}

export interface FeasibilityStudyCorpus {
  [sectionId: string]: CorpusSection
}

export const feasibilityStudyCorpus: FeasibilityStudyCorpus = {
  "1": {
    sectionName: "Summary & Recommendations",
    content: `# Feasibility Study – Executive Summary  

*Generated: 07 Aug 2025 • Consolidated from internal sources and prior studies*  

---

## 1. Project Snapshot  

| Item | Detail |
|---|---|
| **Location** | Weipa, Western Cape York, QLD (Australia) |
| **Leases** | Andoom – Special Bauxite Mining Lease ML7024 (plus ML6024) |
| **Development Window** | 2008–2020 (baseline 2008–2013) |
| **Mine Life** | ~20 years |
| **Mining Method** | Open-pit; truck-and-shovel |
| **Target Market** | China (primary); global demand supports base case |
| **Regulatory Regime** | EPBC Act; Water Resources Act; Sea Dumping Act; QLD EPA & SDPWO Act |
| **Key Agreements** | Western Cape Communities Co-existence Agreement (WCCCA) |

---

## 2. Executive Summary  

- Environmental and operational approvals substantially secured (2008–2013); pathway defined for remaining permits.  
- Phased ramp-up aligns with portfolio strategy; minimizes early capital exposure.  
- NPV (10% DR) positive across modeled sensitivities.  
- IRR ~15% (above 12% hurdle).  
- CAPEX ~US$500M initial; OPEX competitive versus peers.  
- Break-even targeted within five years of first production.  
- 20-year LOM supported by reserve models and optimization studies.  

---

## 3. Finance  

| Metric | Value | Notes |
|---|---|---|
| Discount rate (base) | 10% | Risk-adjusted |
| NPV (10%) | Positive | See sensitivities |
| IRR | ~15% | Above hurdle |
| CAPEX | US$300M (detail), US$500M total incl. contingency | 10% contingency |
| OPEX | US$50/t | Benchmarked to peers |
| Break-even volume | 3 Mtpa | Scenario analysis |

*Sensitivity analysis indicates resilience to price, FX, and cost shocks.*  

---

## 4. Strategic Alignment  

- Tier-1 brownfield expansion in Rio Tinto Aluminium – Weipa hub.  
- Supports goals for reserve replacement, portfolio optimization, and ESG leadership.  
- Leverages existing port and road infrastructure; ~10% incremental share capture potential.  
- Aligned with Rio Tinto Environmental & Communities Standards and *The Way We Work*.  

---

## 5. Regulatory & Approvals  

**Federal**  
- EPBC Act approvals (Commonwealth waters and MNES).  
- Sea Dumping Act consent for marine works.  

**State (Queensland)**  
- SDPWO Act coordination; QLD EPA licenses for Environmentally Relevant Activities.  
- Coordinator-General oversight; design acceptances obtained.  

**Stakeholder Framework**  
- WCCCA provides engagement and social-license structure.  
- EIS program (initiated 2008) with specialist providers across environment and heritage.  

---

## 6. Business Structure  

- **Entity:** Rio Tinto Alcan (100% ownership; no JVs).  
- **Leases:** ML7024 (tidal wharf works), ML6024 (harbor rights).  
- Clear governance and decision rights; balanced capital structure and diversified funding.  

---

## 7. Resources & Reserves  

| Category | Tonnes (Mt) | Grade (% Al₂O₃) | Contained Metal (Mt) | Cut-off (%) | Density (t/m³) | Confidence | Notes |
|---:|---:|---:|---:|---:|---:|---|---|
| Measured | 100 | 45.0 | 45 | 30.5 | — | High | Dense drill grid |
| Indicated | 200 | 42.5 | 85 | 30.5 | — | Moderate | Geo-model validated |
| Inferred | 50 | 40.0 | 20 | 30.5 | — | Low | Further drilling required |
| Proven | 80 | 44.0 | 35 | 30.5 | — | High | Core sampled |
| Probable | 120 | 43.0 | 52 | 30.5 | — | Moderate | Reserve models |

*Estimation follows JORC 2012 guidance with block modeling and geostatistical validation.*  

---

## 8. Risks & Mitigations  

| Risk Class | Key Exposure | Mitigation |
|---|---|---|
| High (III–IV) | Marine Protected Areas; EPBC-listed species | Route optimization; offsets |
| High (III–IV) | Outload equipment failure | Redundant design; regular NDT |
| High (III–IV) | Demand volatility (China) | Diversified offtake; price hedging |
| Moderate (II) | Ground conditions / mobility | Bearing-capacity testing; design margins |
| Moderate (II) | Weather delays | Historical weather analytics; berth redundancy |
| Low (I) | Community relations | WCCCA engagement; benefit sharing |

*Risk register reviewed quarterly; owners assigned and residual risk tracked.*  

---

## 9. Development Options & Decision Rationale  

| Scenario | CAPEX | NPV | IRR | LOM | Key Finding |
|---|---|---|---|---|---|
| 5 Mtpa | Base case | ✔︎ | ✔︎ | 20 y | Meets strategic goals with lower risk |
| 10 Mtpa | +30% | ↑ | ↑ | 18 y | Higher value but larger exposure |
| 15 Mtpa | +60% | Highest | Highest | 16 y | Best NPV but capital-intensive |

*Weighted decision matrix indicates 5 Mtpa preferred, balancing value and risk.*  

---

## 10. Technical Overview  

- **Mining:** open-pit; truck-shovel fleet sized via optimization; ~95% recovery.  
- **Processing:** proven bauxite beneficiation; low-complexity, cost-efficient configuration.  
- **Infrastructure:** 50 MW power, 100 km water pipeline, port upgrades (ML7024).  
- **Geotechnical:** stable host; UCS ~150 MPa; minimal seismicity.  

---

## 11. Assumptions & Validation  

| Domain | Key Assumption | Validation |
|---|---|---|
| Market | US$50/t bauxite | Historical trends; expert consensus |
| Discount rate | 10% | WACC + risk premium |
| Inflation | 2% CPI | Government data and internal forecasts |
| Recovery | 95% | Pilot trials; benchmarks |

*Sensitivity tests (±20%) show robust NPV; contingency plans in place.*  

---

## 12. Timeline (2008–2013 Key Milestones)  

\`\`\`mermaid
gantt
    title Development & Approval Schedule
    dateFormat  YYYY
    section Approvals
    EPBC Approval           :done, a1, 2008, 1y
    State Permits           :done, a2, 2008, 1y
    EIS Public Display      :a3, 2009, 0.5y
    Coordinator-General Eval:after a3, 0.5y
    section Construction
    Early Works             :b1, 2010, 1y
    Plant & Port Build      :b2, 2011, 2y
    Commissioning           :c1, 2013, 0.5y
    section Operations
    Ramp-up to 5 Mtpa       :c2, after c1, 2y
\`\`\`

---

## 13. Recommendations  

### Immediate Actions (0-3 months)
1. **Complete remaining permit applications** - Focus on EIS public display and Coordinator-General evaluation
2. **Finalize financing structure** - Secure debt facilities and equity commitments
3. **Community engagement** - Strengthen WCCCA implementation and stakeholder communication

### Short-term (3-12 months)  
1. **Early works preparation** - Site access, temporary facilities, and preliminary infrastructure
2. **Procurement planning** - Long-lead equipment orders and contractor selection
3. **Risk mitigation** - Implement marine route optimization and offset programs

### Medium-term (1-3 years)
1. **Construction execution** - Plant and port build-out with quality control
2. **Commissioning preparation** - Operational readiness and workforce training
3. **Market development** - Offtake agreements and customer relationships

### Long-term (3+ years)
1. **Production ramp-up** - Achieve 5 Mtpa target with operational excellence
2. **Performance optimization** - Continuous improvement and cost reduction
3. **Expansion evaluation** - Assess 10 Mtpa and 15 Mtpa scenarios based on market conditions

---

## 14. Success Metrics & KPIs  

| Category | Metric | Target | Timeline |
|---|---|---|---|
| **Financial** | NPV (10%) | >US$100M | 20-year LOM |
| **Operational** | Production | 5 Mtpa | Year 3+ |
| **Environmental** | Zero significant incidents | 100% compliance | Ongoing |
| **Social** | Community benefits | WCCCA targets met | Annual review |
| **Technical** | Recovery rate | 95% | Steady state |

---

## 15. Conclusion  

The Weipa bauxite expansion project demonstrates strong economic fundamentals with a robust risk-adjusted return profile. The phased development approach minimizes early capital exposure while positioning Rio Tinto for long-term value creation in the global bauxite market.

Key success factors include:
- **Regulatory compliance** - Maintaining momentum on remaining permits
- **Community engagement** - Building on WCCCA foundation
- **Operational excellence** - Leveraging existing infrastructure and expertise
- **Market positioning** - Capitalizing on growing global bauxite demand

With proper execution, this project will deliver significant value to shareholders while contributing to Rio Tinto's strategic objectives in the aluminium value chain.`
  },

  "2": {
    sectionName: "Business Strategy",
    content: `## 2. Business Strategy

### Strategic Context
The Weipa bauxite expansion represents a strategic investment in Rio Tinto's core aluminium business, leveraging existing infrastructure and market relationships to capture growing global demand.

### Market Positioning
- **Primary Market**: China (70% of global bauxite consumption)
- **Secondary Markets**: India, Middle East, and emerging Asian economies
- **Competitive Advantage**: Low-cost production, established logistics, and long-term customer relationships

### Portfolio Strategy
- **Reserve Replacement**: Extends mine life by 20+ years
- **Geographic Diversification**: Strengthens position in Asia-Pacific region
- **Product Mix**: High-quality bauxite suitable for alumina production

### Value Creation Drivers
1. **Operational Efficiency**: Leveraging existing infrastructure and workforce
2. **Market Access**: Established port facilities and shipping routes
3. **Resource Quality**: High-grade bauxite with low impurities
4. **Cost Leadership**: Competitive production costs vs. global peers

### Risk Management
- **Market Risk**: Diversified customer base and long-term contracts
- **Operational Risk**: Proven mining methods and experienced team
- **Regulatory Risk**: Comprehensive permitting and stakeholder engagement
- **Financial Risk**: Phased development and conservative capital structure`
  },

  "3": {
    sectionName: "Marketing",
    content: `## 3. Marketing Strategy

### Customer Segmentation
- **Primary Customers**: Large alumina producers in China and Asia
- **Secondary Customers**: Emerging markets with growing aluminium demand
- **Strategic Partners**: Long-term supply agreements with key players

### Product Positioning
- **Quality**: High-grade bauxite (45% Al₂O₃) with consistent specifications
- **Reliability**: Proven track record of on-time delivery and quality consistency
- **Sustainability**: Responsible mining practices and environmental stewardship

### Pricing Strategy
- **Market-Based**: Aligned with global bauxite pricing benchmarks
- **Long-term Contracts**: Stable pricing for strategic customers
- **Flexibility**: Spot market participation for additional volumes

### Distribution Channels
- **Direct Sales**: Long-term contracts with major alumina producers
- **Trading Partners**: Strategic relationships with established traders
- **Logistics**: Integrated shipping and port operations

### Market Development
- **Customer Education**: Technical support and product specifications
- **Market Expansion**: Developing new markets and applications
- **Relationship Management**: Regular customer engagement and feedback`
  },

  "4": {
    sectionName: "Country & Regional Settings",
    content: `## 4. Country & Regional Settings

### Australia Overview
- **Political Stability**: Stable democratic government with strong rule of law
- **Economic Environment**: Developed economy with strong mining sector
- **Infrastructure**: World-class ports, roads, and utilities
- **Workforce**: Skilled mining professionals and technical expertise

### Queensland Context
- **Mining Heritage**: Long history of successful mining operations
- **Regulatory Framework**: Comprehensive environmental and mining regulations
- **Infrastructure**: Existing port facilities and transportation networks
- **Community Support**: Strong local support for responsible mining

### Western Cape York Region
- **Geography**: Remote but accessible via established infrastructure
- **Climate**: Tropical climate with seasonal weather patterns
- **Indigenous Communities**: Strong cultural heritage and traditional land use
- **Environmental Values**: Unique ecosystems and biodiversity

### Regional Development
- **Economic Impact**: Significant employment and economic benefits
- **Infrastructure Investment**: Port upgrades and road improvements
- **Community Programs**: Education, training, and local business development
- **Environmental Protection**: Comprehensive monitoring and mitigation programs`
  },

  "5": {
    sectionName: "Security",
    content: `## 5. Security Framework

### Physical Security
- **Site Security**: Controlled access and perimeter protection
- **Asset Protection**: Equipment and infrastructure security measures
- **Personnel Safety**: Comprehensive health and safety protocols

### Information Security
- **Data Protection**: Secure handling of technical and commercial information
- **Cyber Security**: Protection against digital threats and data breaches
- **Intellectual Property**: Safeguarding proprietary technologies and processes

### Supply Chain Security
- **Vendor Management**: Rigorous supplier qualification and monitoring
- **Quality Assurance**: Comprehensive testing and verification protocols
- **Traceability**: Full chain of custody for all materials and products

### Regulatory Compliance
- **Export Controls**: Compliance with international trade regulations
- **Sanctions**: Adherence to global sanctions and trade restrictions
- **Licensing**: Proper permits and authorizations for all operations

### Risk Assessment
- **Threat Analysis**: Regular assessment of security risks and vulnerabilities
- **Mitigation Strategies**: Comprehensive security planning and response protocols
- **Training**: Regular security awareness and response training for staff`
  },

  "6": {
    sectionName: "Government, Stakeholders & Communication",
    content: `## 6. Government, Stakeholders & Communication

### Government Relations
- **Federal Level**: Engagement with Commonwealth departments and agencies
- **State Level**: Coordination with Queensland government and regulators
- **Local Level**: Collaboration with local councils and authorities

### Stakeholder Engagement
- **Indigenous Communities**: Partnership with traditional owners and local communities
- **Environmental Groups**: Dialogue with conservation organizations and activists
- **Industry Associations**: Participation in mining and business organizations
- **Academic Institutions**: Collaboration with universities and research organizations

### Communication Strategy
- **Transparency**: Open and honest communication about project impacts and benefits
- **Regular Updates**: Consistent communication with all stakeholders
- **Feedback Mechanisms**: Multiple channels for stakeholder input and concerns
- **Crisis Communication**: Prepared response protocols for emergency situations

### Community Benefits
- **Employment**: Direct and indirect job creation in local communities
- **Training**: Skills development and career advancement opportunities
- **Infrastructure**: Investment in local roads, utilities, and facilities
- **Business Development**: Support for local suppliers and service providers

### Regulatory Compliance
- **Permitting**: Comprehensive environmental and social impact assessments
- **Monitoring**: Regular reporting and compliance verification
- **Adaptation**: Continuous improvement based on regulatory feedback`
  },

  "7": {
    sectionName: "Communities & Social Performance (CSP)",
    content: `## 7. Communities & Social Performance (CSP)

### Social Impact Assessment
- **Community Profile**: Understanding local demographics and social structures
- **Impact Analysis**: Assessment of project effects on local communities
- **Mitigation Strategies**: Plans to minimize negative social impacts
- **Enhancement Opportunities**: Ways to maximize positive social benefits

### Indigenous Engagement
- **Traditional Owner Rights**: Recognition and respect for indigenous land rights
- **Cultural Heritage**: Protection of significant cultural sites and practices
- **Economic Participation**: Opportunities for indigenous business development
- **Capacity Building**: Training and development for indigenous community members

### Community Development
- **Education**: Support for local schools and educational programs
- **Healthcare**: Investment in local health facilities and services
- **Housing**: Support for local housing development and improvement
- **Recreation**: Investment in community facilities and recreational opportunities

### Social Performance Monitoring
- **Key Performance Indicators**: Metrics for measuring social impact
- **Regular Assessment**: Ongoing evaluation of social performance
- **Stakeholder Feedback**: Input from community members and organizations
- **Continuous Improvement**: Adaptation based on performance and feedback

### Grievance Mechanisms
- **Complaint Procedures**: Clear processes for addressing community concerns
- **Independent Review**: Third-party review of grievance resolution
- **Timely Response**: Prompt attention to community issues and concerns
- **Transparency**: Open communication about grievance handling and resolution`
  },

  "8": {
    sectionName: "Human Resources & Industrial Relations",
    content: `## 8. Human Resources & Industrial Relations

### Workforce Planning
- **Skills Assessment**: Evaluation of required skills and competencies
- **Recruitment Strategy**: Plans for attracting and hiring qualified personnel
- **Training Programs**: Development and delivery of necessary training
- **Succession Planning**: Preparation for future leadership and technical needs

### Employment Practices
- **Equal Opportunity**: Commitment to diversity and inclusion in the workplace
- **Fair Compensation**: Competitive wages and benefits packages
- **Career Development**: Opportunities for advancement and skill development
- **Work-Life Balance**: Support for employee well-being and family needs

### Industrial Relations
- **Union Relations**: Positive relationships with employee representatives
- **Collective Bargaining**: Fair and constructive negotiation processes
- **Dispute Resolution**: Effective mechanisms for resolving workplace conflicts
- **Communication**: Open and transparent communication with employees

### Health and Safety
- **Safety Culture**: Strong commitment to workplace safety and health
- **Training Programs**: Comprehensive safety training for all employees
- **Incident Prevention**: Proactive measures to prevent accidents and injuries
- **Emergency Response**: Preparedness for emergency situations and incidents

### Employee Engagement
- **Feedback Mechanisms**: Regular opportunities for employee input and feedback
- **Recognition Programs**: Acknowledgment of employee contributions and achievements
- **Team Building**: Activities to strengthen team relationships and collaboration
- **Continuous Improvement**: Ongoing efforts to enhance employee satisfaction and engagement`
  }
}

// Helper function to get corpus section by ID
export const getCorpusSection = (sectionId: string): CorpusSection | undefined => {
  return feasibilityStudyCorpus[sectionId]
}

// Helper function to get all available section IDs
export const getAvailableSectionIds = (): string[] => {
  return Object.keys(feasibilityStudyCorpus)
}

// Helper function to check if a section exists
export const hasCorpusSection = (sectionId: string): boolean => {
  return sectionId in feasibilityStudyCorpus
}

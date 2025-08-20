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
    content: `# Strategic Alignment

## Rio Tinto's stated strategy and commodity goals
- The South of Embley project aligns with Rio Tinto Alcan's Weipa operations expansion strategy and Rio Tinto's aluminum business strategy.
- The project targets increased bauxite production capacity to serve growing Chinese alumina markets.
- New processing facilities and port infrastructure are planned for the Boyd Point area.
- Integration with Comalco Alumina Refinery (CAR) Stage 2 development is designed to optimize operational synergies and maximize value from existing Weipa bauxite deposits.
- Project execution prioritizes optimized deposit sequencing, with South of Embley development preceding areas north of Wenlock River.
- Operational considerations include water access security through existing sub-artesian and artesian licenses, with renewals required in 2009; current license utilization remains below capacity limits and future requirements are projected within existing thresholds.
- Water security strategy encompasses multiple licensed sources with renewal planning for 2009 and expansion area coverage.
- The project maintains compliance with multiple regulatory frameworks, including the WCCCA and WR Act, while pursuing development approvals through 2008–2013.
- Project approval is being pursued through Queensland's SDPWO Act pathway, leveraging established state-level processes for major project development.
- Option 3, an accredited alternative approval pathway, is being utilized to optimize the regulatory approach given the project's likely classification as a “controlled action” under the Commonwealth EPBC Act.
- Strategic risks include potential establishment of Marine Protected Areas (MPA) west of Boyd Point by DEWHA, which could impact operational flexibility for dredging and spoil-disposal activities.
- The development approach is supported by COMET and XPAC modeling, enabling efficient capital deployment and operational flexibility through staged development of Boyd/Pera deposits, Norman Creek, and LMB resources.
- Strategic imperatives include safety focus, automation implementation, mining optimization, and haul-distance reduction.
- The project aligns with Rio Tinto's corporate strategy by focusing on commodity expansion and supply security, particularly in the aluminum sector, with a growth posture centered on expansion and reserve replacement.
- The project is classified as a Tier 1 expansion initiative, aimed at securing supply, reserve replacement, and regional consolidation.
- Integration benefits include increased production capacity and improved supply-chain security.

## “Do Nothing” scenario vs. opportunity capture
- The project is expected to increase annual output by 15% and reduce operational costs by 10%.
- The “Do Nothing” scenario presents significant risks, including a potential market share loss of 5%, a volume reduction of 20 million tonnes per annum, and a revenue impact of $500 million annually; another source estimates a negative revenue impact of 15% over the next five years.

## Why this project outperforms the next best alternative
- The project selection is justified against the next best alternatives, with a superior NPV of USD 1.2 billion and a payback period of 4.5–5 years, outperforming the Rio Tinto portfolio average of 5 years and the next best option by 20% in terms of ESG risk assessment.

## Internal and external benchmarking highlights
- Internal benchmarking indicates an IRR of 18%, exceeding the Rio Tinto portfolio average of 15–16%.
- External benchmarking against competitors shows a lower cost per tonne and a longer LOM, positioning the project favorably within the industry.
- The project's ESG risk assessment indicates a lower environmental impact compared to similar projects.`
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

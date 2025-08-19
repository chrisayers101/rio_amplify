// ============================================================================
// AUTHENTICATION INTERFACES
// ============================================================================

export interface AppUser {
  userId: string
  username: string
  email: string
  name?: string
  givenName?: string
  familyName?: string
  signInDetails?: Record<string, unknown>
}

// ============================================================================
// CHAT INTERFACES
// ============================================================================

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  type: 'user' | 'agent' | 'system'
  status: 'sending' | 'sent' | 'error' | 'streaming'
  metadata?: {
    rating?: 'up' | 'down' | null
    tokens?: number
    model?: string
    tools?: string[]
    context?: {
      projects?: string[]
      minerals?: string[]
      audience?: string[]
    }
  }
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  context: {
    projects: string[]
    minerals: string[]
    audience: string[]
  }
}

// ============================================================================
// CHAT API INTERFACES
// ============================================================================

export interface ChatRequest<T = Record<string, unknown>, U = Record<string, unknown>> {
  message: string
  threadId?: string
  context?: {
    selectedEntity?: T
    matchingGuideline?: U
  }
  messages?: unknown[] // Conversation history from Pinia store
}

export interface ChatResponse {
  type: 'chunk' | 'error'
  content: string
  threadId: string
}

// ============================================================================
// S3 AND STORAGE INTERFACES
// ============================================================================

export interface S3Object {
  key: string
  size?: number
  lastModified?: Date
  eTag?: string
}

export interface S3ProxyListResponse {
  objects: S3Object[]
  isTruncated: boolean
  nextContinuationToken?: string
}

export interface S3ProxyUploadResponse {
  uploadUrl: string
  key: string
  bucketName: string
}

export interface S3ProxyDownloadResponse {
  downloadUrl: string
  key: string
  bucketName: string
}

export interface S3ProxySignedUrlResponse {
  signedUrl: string
  key: string
  bucketName: string
}

export interface S3ProxyDeleteResponse {
  message: string
  key: string
  bucketName: string
}

export interface ExistingBucketConfig {
  name: string
  displayName: string
  bucketName: string
}

// ============================================================================
// PROJECT INTERFACES
// ============================================================================

export interface Evaluation {
  commercial?: {
    contracts_structure: string
    key_issues: string
    status: string
    capital_cost_usd_billion: number | null
    npv_usd_billion: number | null
    irr_percent: string | null
    cost_risk_analysis: {
      contingency_percent: number
      escalation_allowance_percent: number
      confidence_class: string
    }
    contract_type: string
  }
  hse?: {
    eis_status: string
    rio_tinto_standards_aligned: boolean
    key_issues: string
    workforce_hse_statistics: {
      ltifr: number | null
      fatalities: number
    }
    ltif_trend_3yr: (number | null)[]
    fatality_prevention_controls: string
  }
  technical?: {
    compliance_study_definition_guidelines: string
    red_flags: Array<{
      category: string
      severity: string
      description: string
    }>
    sme: {
      electrical: string
      environmental: string
    }
    design_maturity_percent: number
    technology_readiness_level: number
  }
  asset_management?: {
    mine_life_years: number
    rehabilitation_provision_usd_billion: number
    sustaining_capex_usd_billion: number
    opex_usd_per_tonne: number
  }
  schedule?: {
    expected_first_production_year: number | null
    major_milestones: Array<{
      name: string
      date: string
    }>
    critical_path_issues: string
    schedule_risk_index: number
  }
}

export interface Project {
  id: string
  name: string
  country_region?: string
  key_minerals?: string[]
  capital_cost_usd_billion?: number | null
  npv_usd_billion?: number | null
  post_tax_irr_percent?: string | null
  workforce_construction_ops?: string | null
  current_status?: string
  key_issues_risks?: string
  summary?: string
  icon?: unknown
  status?: string
  color?: string
  milestones?: Array<{
    date: string
    title: string
    description: string
    status: string
  }>
  evaluation?: Evaluation
}



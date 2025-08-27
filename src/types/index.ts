// Enum types matching database
export type CompanySize = 'micro' | 'small' | 'medium' | 'large'
export type SectorType = 'tech' | 'manufacturing' | 'services' | 'retail' | 'healthcare' | 'construction' | 'food' | 'logistics' | 'energy' | 'agriculture' | 'tourism' | 'other'
export type InvestmentGoal = 'digitalization' | 'research' | 'green' | 'international' | 'training' | 'innovation' | 'expansion' | 'other'
export type RegionType = 'lombardia' | 'lazio' | 'veneto' | 'emilia-romagna' | 'piemonte' | 'toscana' | 'campania' | 'sicilia' | 'puglia' | 'calabria' | 'sardegna' | 'friuli' | 'liguria' | 'marche' | 'abruzzo' | 'umbria' | 'basilicata' | 'molise' | 'trentino' | 'valle-aosta'
export type ContributionType = 'fondo_perduto' | 'finanziamento_agevolato' | 'credito_imposta' | 'misto'
export type BandoStatus = 'active' | 'closed' | 'coming_soon' | 'draft'

// Priority levels for matches
export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'low'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

// Company interface
export interface Company {
    id?: string
    company_name: string
    first_name: string
    last_name: string
    email: string
    sector: SectorType
    region: RegionType
    company_size: CompanySize
    investment_goal: InvestmentGoal
    created_at?: string
    updated_at?: string
}

// Bando interface
export interface Bando {
    id: string
    title: string
    description: string
    ente_erogatore: string
    contribution_type: ContributionType
    min_amount: number
    max_amount: number
    eligible_sectors: SectorType[]
    eligible_regions: RegionType[]
    eligible_company_sizes: CompanySize[]
    eligible_investment_goals: InvestmentGoal[]
    opening_date: string
    closing_date: string
    status: BandoStatus
    official_url?: string
    created_at: string
    updated_at: string
}

// Enhanced match reasons with all algorithm details
export interface MatchReasons {
    // Basic criteria (original)
    sector_match: boolean
    region_match: boolean
    size_match: boolean
    goal_match: boolean

    // Advanced algorithm additions
    confidence_level?: ConfidenceLevel
    success_rate?: number
    priority?: PriorityLevel

    // Detailed scoring
    score_details?: {
        sector_score: number
        region_score: number
        size_score: number
        goal_score: number
        bonus_score: number
        penalty_score: number
    }

    // Analysis arrays
    matching_features?: string[]
    missing_requirements?: string[]
    suggestions?: string[]
}

// Match interface - compatibile con database e algoritmo
export interface Match {
    id: string
    company_id: string
    bando_id: string
    match_score: number
    match_reasons: MatchReasons | any // Flessibile per retrocompatibilità
    viewed?: boolean
    saved?: boolean
    created_at: string
    bando?: Bando // Join with bando data quando caricato
}

// Form data for company profile
export interface CompanyFormData {
    companyName: string
    firstName: string
    lastName: string
    email: string
    sector: SectorType
    region: RegionType
    companySize: CompanySize
    investmentGoal: InvestmentGoal
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
    success: boolean
    message?: string
}

// Match filters
export interface MatchFilters {
    minScore?: number
    priority?: PriorityLevel
    sector?: SectorType
    region?: RegionType
    confidenceLevel?: ConfidenceLevel
}

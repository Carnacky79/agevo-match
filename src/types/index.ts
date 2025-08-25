// Enum types matching database
export type CompanySize = 'micro' | 'small' | 'medium' | 'large'
export type SectorType = 'tech' | 'manufacturing' | 'services' | 'retail' | 'healthcare' | 'construction' | 'food' | 'logistics' | 'energy' | 'agriculture' | 'tourism' | 'other'
export type InvestmentGoal = 'digitalization' | 'research' | 'green' | 'international' | 'training' | 'innovation' | 'expansion' | 'other'
export type RegionType = 'lombardia' | 'lazio' | 'veneto' | 'emilia-romagna' | 'piemonte' | 'toscana' | 'campania' | 'sicilia' | 'puglia' | 'calabria' | 'sardegna' | 'friuli' | 'liguria' | 'marche' | 'abruzzo' | 'umbria' | 'basilicata' | 'molise' | 'trentino' | 'valle-aosta'
export type ContributionType = 'fondo_perduto' | 'finanziamento_agevolato' | 'credito_imposta' | 'misto'

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
    status: 'active' | 'closed' | 'coming_soon' | 'draft'
    official_url?: string
    created_at: string
    updated_at: string
}

// Match interface
export interface Match {
    id: string
    company_id: string
    bando_id: string
    match_score: number
    match_reasons: {
        sector_match: boolean
        region_match: boolean
        size_match: boolean
        goal_match: boolean
    }
    viewed: boolean
    saved: boolean
    created_at: string
    bando?: Bando // Join with bando data
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

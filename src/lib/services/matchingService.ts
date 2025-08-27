/**
 * AGEVO MATCH - Servizio di Matching Intelligente
 * 
 * Questo servizio implementa l'algoritmo core che calcola la compatibilità
 * tra un'azienda e un bando basandosi su molteplici criteri pesati.
 * 
 * Score Range: 0-100%
 * - 90-100%: Match ECCELLENTE (altissima probabilità di successo)
 * - 70-89%: Match OTTIMO (forte compatibilità)
 * - 50-69%: Match BUONO (vale la pena tentare)
 * - 30-49%: Match SUFFICIENTE (possibile ma non ideale)
 * - 0-29%: Match SCARSO (non consigliato)
 */

import { Company, Bando } from '@/types'

export interface MatchCriteria {
  sector_match: boolean
  region_match: boolean
  size_match: boolean
  goal_match: boolean
  score_details: {
    sector_score: number
    region_score: number
    size_score: number
    goal_score: number
    bonus_score: number
    penalty_score: number
  }
  matching_features: string[]
  missing_requirements: string[]
  suggestions: string[]
}

export interface MatchResult {
  bando_id: string
  company_id: string
  total_score: number
  criteria: MatchCriteria
  confidence_level: 'high' | 'medium' | 'low'
  estimated_success_rate: number
  priority: 'urgent' | 'high' | 'normal' | 'low'
}

/**
 * Servizio principale di Matching
 */
export class MatchingService {
  
  // Pesi per ogni criterio (totale = 100)
  private readonly WEIGHTS = {
    SECTOR: 35,        // Il settore è il criterio più importante
    REGION: 25,        // La localizzazione è critica per molti bandi
    SIZE: 20,          // La dimensione aziendale è spesso vincolante
    GOAL: 20,          // L'obiettivo di investimento deve allinearsi
    BONUS_MAX: 10,     // Bonus aggiuntivi possono portare fino a 110%
    PENALTY_MAX: -20  // Penalità possono ridurre il punteggio
  }

  // Configurazione soglie
  private readonly THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 70,
    FAIR: 50,
    POOR: 30
  }

  /**
   * Calcola il matching tra un'azienda e tutti i bandi disponibili
   */
  public calculateAllMatches(
    company: Company | any, 
    bandi: Bando[]
  ): MatchResult[] {
    const results: MatchResult[] = []
    
    for (const bando of bandi) {
      const matchResult = this.calculateSingleMatch(company, bando)
      
      // Includiamo solo match con score >= 30%
      if (matchResult.total_score >= this.THRESHOLDS.POOR) {
        results.push(matchResult)
      }
    }
    
    // Ordina per score decrescente
    return results.sort((a, b) => b.total_score - a.total_score)
  }

  /**
   * Calcola il matching tra un'azienda e un singolo bando
   */
  public calculateSingleMatch(
    company: Company | any,
    bando: Bando
  ): MatchResult {
    
    const criteria: MatchCriteria = {
      sector_match: false,
      region_match: false,
      size_match: false,
      goal_match: false,
      score_details: {
        sector_score: 0,
        region_score: 0,
        size_score: 0,
        goal_score: 0,
        bonus_score: 0,
        penalty_score: 0
      },
      matching_features: [],
      missing_requirements: [],
      suggestions: []
    }

    // 1. CALCOLO SETTORE (35%)
    if (this.checkSectorMatch(company, bando)) {
      criteria.sector_match = true
      criteria.score_details.sector_score = this.WEIGHTS.SECTOR
      criteria.matching_features.push('Settore aziendale compatibile')
    } else {
      criteria.missing_requirements.push('Settore non ammesso dal bando')
      // Penalità parziale se il settore è "services" (generico)
      if (company.sector === 'services' && bando.eligible_sectors.length > 3) {
        criteria.score_details.sector_score = this.WEIGHTS.SECTOR * 0.3
        criteria.suggestions.push('Il settore "servizi" potrebbe essere parzialmente compatibile')
      }
    }

    // 2. CALCOLO REGIONE (25%)
    if (this.checkRegionMatch(company, bando)) {
      criteria.region_match = true
      criteria.score_details.region_score = this.WEIGHTS.REGION
      criteria.matching_features.push('Regione ammessa')
    } else {
      criteria.missing_requirements.push('Regione non coperta dal bando')
      // Check se il bando è nazionale (copre molte regioni)
      if (bando.eligible_regions.length > 10) {
        criteria.score_details.region_score = this.WEIGHTS.REGION * 0.5
        criteria.suggestions.push('Verifica se ci sono eccezioni per la tua regione')
      }
    }

    // 3. CALCOLO DIMENSIONE AZIENDALE (20%)
    if (this.checkSizeMatch(company, bando)) {
      criteria.size_match = true
      criteria.score_details.size_score = this.WEIGHTS.SIZE
      criteria.matching_features.push('Dimensione aziendale idonea')
    } else {
      criteria.missing_requirements.push('Dimensione aziendale non compatibile')
      // Check se l'azienda è al limite
      if (this.isOnSizeBorder(company, bando)) {
        criteria.score_details.size_score = this.WEIGHTS.SIZE * 0.4
        criteria.suggestions.push('Potresti qualificarti con piccole modifiche strutturali')
      }
    }

    // 4. CALCOLO OBIETTIVO INVESTIMENTO (20%)
    if (this.checkGoalMatch(company, bando)) {
      criteria.goal_match = true
      criteria.score_details.goal_score = this.WEIGHTS.GOAL
      criteria.matching_features.push('Obiettivi di investimento allineati')
    } else {
      criteria.missing_requirements.push('Obiettivi non allineati con il bando')
      // Check per obiettivi correlati
      if (this.hasRelatedGoals(company, bando)) {
        criteria.score_details.goal_score = this.WEIGHTS.GOAL * 0.5
        criteria.suggestions.push('Gli obiettivi sono parzialmente correlati')
      }
    }

    // 5. CALCOLO BONUS
    criteria.score_details.bonus_score = this.calculateBonuses(company, bando, criteria)

    // 6. CALCOLO PENALITÀ
    criteria.score_details.penalty_score = this.calculatePenalties(company, bando, criteria)

    // CALCOLO SCORE TOTALE
    const baseScore = 
      criteria.score_details.sector_score +
      criteria.score_details.region_score +
      criteria.score_details.size_score +
      criteria.score_details.goal_score

    const totalScore = Math.max(0, Math.min(100, 
      baseScore + 
      criteria.score_details.bonus_score + 
      criteria.score_details.penalty_score
    ))

    // Determina confidence level
    const confidenceLevel = this.getConfidenceLevel(criteria)
    
    // Stima success rate (probabilità di ottenere il finanziamento)
    const successRate = this.estimateSuccessRate(totalScore, criteria)
    
    // Determina priorità
    const priority = this.determinePriority(bando, totalScore)

    return {
      bando_id: bando.id,
      company_id: company.id || '',
      total_score: Math.round(totalScore),
      criteria,
      confidence_level: confidenceLevel,
      estimated_success_rate: successRate,
      priority
    }
  }

  /**
   * Check criteri base
   */
  private checkSectorMatch(company: any, bando: Bando): boolean {
    return bando.eligible_sectors.includes(company.sector || company.companyData?.sector)
  }

  private checkRegionMatch(company: any, bando: Bando): boolean {
    return bando.eligible_regions.includes(company.region || company.companyData?.region)
  }

  private checkSizeMatch(company: any, bando: Bando): boolean {
    const size = company.company_size || company.companySize || company.companyData?.companySize
    return bando.eligible_company_sizes.includes(size)
  }

  private checkGoalMatch(company: any, bando: Bando): boolean {
    const goal = company.investment_goal || company.investmentGoal || company.companyData?.investmentGoal
    return bando.eligible_investment_goals.includes(goal)
  }

  /**
   * Check avanzati
   */
  private isOnSizeBorder(company: any, bando: Bando): boolean {
    const size = company.company_size || company.companySize
    
    // Se è micro ma il bando accetta small
    if (size === 'micro' && bando.eligible_company_sizes.includes('small')) {
      return true
    }
    // Se è small ma il bando accetta medium
    if (size === 'small' && bando.eligible_company_sizes.includes('medium')) {
      return true
    }
    
    return false
  }

  private hasRelatedGoals(company: any, bando: Bando): boolean {
    const goal = company.investment_goal || company.investmentGoal
    
    // Mapping di obiettivi correlati
    const relatedGoals: Record<string, string[]> = {
      'digitalization': ['innovation', 'research'],
      'innovation': ['digitalization', 'research'],
      'green': ['innovation', 'expansion'],
      'research': ['innovation', 'digitalization'],
      'international': ['expansion', 'training'],
      'expansion': ['international', 'green'],
      'training': ['digitalization', 'innovation']
    }
    
    const related = relatedGoals[goal] || []
    return bando.eligible_investment_goals.some(g => related.includes(g))
  }

  /**
   * Calcola bonus aggiuntivi
   */
  private calculateBonuses(company: any, bando: Bando, criteria: MatchCriteria): number {
    let bonus = 0
    
    // Bonus per match perfetto (tutti e 4 i criteri)
    if (criteria.sector_match && criteria.region_match && 
        criteria.size_match && criteria.goal_match) {
      bonus += 5
      criteria.matching_features.push('✨ Match perfetto su tutti i criteri!')
    }
    
    // Bonus per bandi in scadenza (urgenza)
    if (bando.closing_date) {
      const daysToDeadline = this.getDaysToDeadline(bando.closing_date)
      if (daysToDeadline <= 15) {
        bonus += 3
        criteria.matching_features.push('⏰ Bando in scadenza imminente')
      }
    }
    
    // Bonus per bandi con budget elevato
    if (bando.max_amount && bando.max_amount > 50000) {
      bonus += 2
      criteria.matching_features.push('💰 Budget elevato disponibile')
    }
    
    return Math.min(bonus, this.WEIGHTS.BONUS_MAX)
  }

  /**
   * Calcola penalità
   */
  private calculatePenalties(company: any, bando: Bando, criteria: MatchCriteria): number {
    let penalty = 0
    
    // Penalità se nessun criterio principale matcha
    const matchCount = [
      criteria.sector_match,
      criteria.region_match,
      criteria.size_match,
      criteria.goal_match
    ].filter(Boolean).length
    
    if (matchCount === 0) {
      penalty -= 10
      criteria.missing_requirements.push('⚠️ Nessun criterio principale soddisfatto')
    } else if (matchCount === 1) {
      penalty -= 5
      criteria.suggestions.push('Solo un criterio soddisfatto - candidatura difficile')
    }
    
    // Penalità per bandi molto specifici
    if (bando.eligible_sectors.length === 1 && !criteria.sector_match) {
      penalty -= 5
      criteria.missing_requirements.push('Bando molto specifico per settore')
    }
    
    return Math.max(penalty, this.WEIGHTS.PENALTY_MAX)
  }

  /**
   * Determina il livello di confidenza del match
   */
  private getConfidenceLevel(criteria: MatchCriteria): 'high' | 'medium' | 'low' {
    const matchCount = [
      criteria.sector_match,
      criteria.region_match,
      criteria.size_match,
      criteria.goal_match
    ].filter(Boolean).length
    
    if (matchCount >= 3) return 'high'
    if (matchCount >= 2) return 'medium'
    return 'low'
  }

  /**
   * Stima la probabilità di successo
   */
  private estimateSuccessRate(score: number, criteria: MatchCriteria): number {
    let rate = score * 0.8 // Base: 80% del score
    
    // Aggiustamenti basati su confidence
    if (criteria.sector_match) rate += 5
    if (criteria.region_match) rate += 5
    if (criteria.size_match) rate += 5
    if (criteria.goal_match) rate += 5
    
    return Math.min(95, Math.round(rate))
  }

  /**
   * Determina la priorità del bando
   */
  private determinePriority(
    bando: Bando, 
    score: number
  ): 'urgent' | 'high' | 'normal' | 'low' {
    const days = bando.closing_date ? this.getDaysToDeadline(bando.closing_date) : 999
    
    // Urgente: alta compatibilità + scadenza vicina
    if (score >= 70 && days <= 15) return 'urgent'
    
    // Alta: ottimo score o scadenza imminente
    if (score >= 85 || days <= 7) return 'high'
    
    // Normale: buon score
    if (score >= 50) return 'normal'
    
    // Bassa: score basso
    return 'low'
  }

  /**
   * Utility: calcola giorni alla scadenza
   */
  private getDaysToDeadline(closingDate: string): number {
    const deadline = new Date(closingDate)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * Genera un report dettagliato del matching
   */
  public generateMatchReport(result: MatchResult, bando: Bando): string {
    const { criteria, total_score, confidence_level, estimated_success_rate, priority } = result
    
    let report = `📊 REPORT DI COMPATIBILITÀ\n`
    report += `${'='.repeat(50)}\n\n`
    
    report += `Bando: ${bando.title}\n`
    report += `Ente: ${bando.ente_erogatore}\n\n`
    
    report += `PUNTEGGIO TOTALE: ${total_score}%\n`
    report += `Livello di Confidenza: ${confidence_level.toUpperCase()}\n`
    report += `Probabilità di Successo: ${estimated_success_rate}%\n`
    report += `Priorità: ${priority.toUpperCase()}\n\n`
    
    report += `ANALISI DETTAGLIATA:\n`
    report += `${'-'.repeat(30)}\n`
    
    // Criteri soddisfatti
    if (criteria.matching_features.length > 0) {
      report += `✅ Punti di Forza:\n`
      criteria.matching_features.forEach(f => report += `   • ${f}\n`)
      report += `\n`
    }
    
    // Requisiti mancanti
    if (criteria.missing_requirements.length > 0) {
      report += `❌ Requisiti Mancanti:\n`
      criteria.missing_requirements.forEach(r => report += `   • ${r}\n`)
      report += `\n`
    }
    
    // Suggerimenti
    if (criteria.suggestions.length > 0) {
      report += `💡 Suggerimenti:\n`
      criteria.suggestions.forEach(s => report += `   • ${s}\n`)
      report += `\n`
    }
    
    // Breakdown punteggi
    report += `DETTAGLIO PUNTEGGI:\n`
    report += `   Settore: ${criteria.score_details.sector_score}/${this.WEIGHTS.SECTOR}\n`
    report += `   Regione: ${criteria.score_details.region_score}/${this.WEIGHTS.REGION}\n`
    report += `   Dimensione: ${criteria.score_details.size_score}/${this.WEIGHTS.SIZE}\n`
    report += `   Obiettivi: ${criteria.score_details.goal_score}/${this.WEIGHTS.GOAL}\n`
    
    if (criteria.score_details.bonus_score > 0) {
      report += `   Bonus: +${criteria.score_details.bonus_score}\n`
    }
    if (criteria.score_details.penalty_score < 0) {
      report += `   Penalità: ${criteria.score_details.penalty_score}\n`
    }
    
    return report
  }
}

// Esporta un'istanza singleton
export const matchingService = new MatchingService()
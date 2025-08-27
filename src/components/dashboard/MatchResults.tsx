'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Match, Company } from '@/types'
import { CONTRIBUTION_TYPES } from '@/utils/constants'

interface MatchResultsProps {
  companyId: string
}

export function MatchResults({ companyId }: MatchResultsProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('all')

  useEffect(() => {
    loadMatches()
  }, [companyId])

  const loadMatches = async () => {
    try {
      // Load company data
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      setCompany(companyData)

      // Load matches with bando data
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          bando:bandi(*)
        `)
        .eq('company_id', companyId)
        .order('match_score', { ascending: false })

      setMatches(matchesData || [])
    } catch (error) {
      console.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-purple-100 text-purple-800 border-purple-300'
    if (score >= 70) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'urgent':
        return <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">URGENTE</span>
      case 'high':
        return <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">ALTA</span>
      case 'normal':
        return <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">NORMALE</span>
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">BASSA</span>
    }
  }

  const getConfidenceStars = (level: string) => {
    const stars = level === 'high' ? 3 : level === 'medium' ? 2 : 1
    return '⭐'.repeat(stars) + '☆'.repeat(3 - stars)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredMatches = filterPriority === 'all' 
    ? matches 
    : matches.filter(m => m.match_reasons?.priority === filterPriority)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analisi algoritmica in corso...</p>
          <p className="text-sm text-gray-500 mt-2">Il nostro AI sta valutando oltre 50 parametri...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Analisi completata per {company?.company_name}
        </h2>
        <p className="text-gray-600 mb-4">
          Abbiamo trovato <span className="font-bold text-blue-600">{matches.length} bandi compatibili</span> con il tuo profilo aziendale.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {matches.filter(m => m.match_score >= 90).length}
            </div>
            <div className="text-xs text-gray-600">Match Eccellenti</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter(m => m.match_score >= 70 && m.match_score < 90).length}
            </div>
            <div className="text-xs text-gray-600">Match Ottimi</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {matches.filter(m => m.match_score >= 50 && m.match_score < 70).length}
            </div>
            <div className="text-xs text-gray-600">Match Buoni</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {matches.filter(m => m.match_reasons?.priority === 'urgent').length}
            </div>
            <div className="text-xs text-gray-600">Urgenti</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterPriority('all')}
          className={`px-4 py-2 rounded-lg ${filterPriority === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Tutti ({matches.length})
        </button>
        <button
          onClick={() => setFilterPriority('urgent')}
          className={`px-4 py-2 rounded-lg ${filterPriority === 'urgent' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Urgenti
        </button>
        <button
          onClick={() => setFilterPriority('high')}
          className={`px-4 py-2 rounded-lg ${filterPriority === 'high' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Priorità Alta
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid gap-6">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getMatchColor(match.match_score)}`}>
                    {match.match_score}% MATCH
                  </span>
                  {match.match_reasons?.priority && getPriorityBadge(match.match_reasons.priority)}
                  {match.match_reasons?.confidence_level && (
                    <span className="text-sm text-gray-600">
                      Confidenza: {getConfidenceStars(match.match_reasons.confidence_level)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {match.bando?.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {match.bando?.description}
                </p>

                {/* Success Rate */}
                {match.match_reasons?.success_rate && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Probabilità di successo:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 max-w-xs">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                          style={{ width: `${match.match_reasons.success_rate}%` }}
                        >
                          {match.match_reasons.success_rate}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Match Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Ente erogatore</p>
                <p className="font-semibold">{match.bando?.ente_erogatore}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipologia</p>
                <p className="font-semibold">
                  {CONTRIBUTION_TYPES.find(t => t.value === match.bando?.contribution_type)?.icon}
                  {' '}
                  {CONTRIBUTION_TYPES.find(t => t.value === match.bando?.contribution_type)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Importo</p>
                <p className="font-semibold">
                  {match.bando && `${formatAmount(match.bando.min_amount)} - ${formatAmount(match.bando.max_amount)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scadenza</p>
                <p className="font-semibold">
                  {match.bando && new Date(match.bando.closing_date).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>

            {/* Advanced Match Reasons */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Analisi di compatibilità:</p>
                <button
                  onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedMatch?.id === match.id ? 'Nascondi dettagli' : 'Mostra dettagli'} →
                </button>
              </div>

              {/* Basic Criteria */}
              <div className="flex flex-wrap gap-2">
                {match.match_reasons?.sector_match && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm">
                    ✓ Settore compatibile
                  </span>
                )}
                {match.match_reasons?.region_match && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm">
                    ✓ Regione ammessa
                  </span>
                )}
                {match.match_reasons?.size_match && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm">
                    ✓ Dimensione idonea
                  </span>
                )}
                {match.match_reasons?.goal_match && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm">
                    ✓ Obiettivo allineato
                  </span>
                )}
              </div>

              {/* Detailed Analysis (expandable) */}
              {selectedMatch?.id === match.id && match.match_reasons && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  {/* Matching Features */}
                  {match.match_reasons.matching_features?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-green-700 mb-2">✅ Punti di forza:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {match.match_reasons.matching_features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Missing Requirements */}
                  {match.match_reasons.missing_requirements?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-red-700 mb-2">❌ Requisiti mancanti:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {match.match_reasons.missing_requirements.map((req, i) => (
                          <li key={i}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {match.match_reasons.suggestions?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">💡 Suggerimenti:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {match.match_reasons.suggestions.map((suggestion, i) => (
                          <li key={i}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <a
                href={match.bando?.official_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                Candidati ora →
              </a>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                💾 Salva
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                📊 Report PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No matches */}
      {filteredMatches.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">
            Nessun bando trovato con i filtri selezionati.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mt-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Vuoi aumentare le tue chance di successo?
        </h3>
        <p className="mb-6">
          I nostri consulenti esperti possono guidarti nella preparazione della candidatura perfetta.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Richiedi consulenza personalizzata →
        </button>
      </div>
    </div>
  )
}
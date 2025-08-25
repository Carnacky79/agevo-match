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
        if (score >= 75) return 'bg-green-100 text-green-800'
        if (score >= 50) return 'bg-yellow-100 text-yellow-800'
        return 'bg-gray-100 text-gray-800'
    }

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Analisi in corso...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 Ottimo {company?.first_name}! Abbiamo trovato {matches.length} bandi per {company?.company_name}
                </h2>
                <p className="text-gray-600">
                    Ecco i bandi più compatibili con il tuo profilo aziendale, ordinati per percentuale di matching.
                </p>
            </div>

            {/* Matches Grid */}
            <div className="grid gap-6">
                {matches.map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(match.match_score)}`}>
                    {match.match_score}% Match
                  </span>
                                    {match.bando && (
                                        <span className="text-sm text-gray-500">
                      {CONTRIBUTION_TYPES.find(t => t.value === match.bando?.contribution_type)?.icon}
                                            {' '}
                                            {CONTRIBUTION_TYPES.find(t => t.value === match.bando?.contribution_type)?.label}
                    </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {match.bando?.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {match.bando?.description}
                                </p>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Ente erogatore</p>
                                <p className="font-semibold">{match.bando?.ente_erogatore}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Importo</p>
                                <p className="font-semibold">
                                    {match.bando && formatAmount(match.bando.min_amount)} - {match.bando && formatAmount(match.bando.max_amount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Scadenza</p>
                                <p className="font-semibold">
                                    {match.bando && new Date(match.bando.closing_date).toLocaleDateString('it-IT')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Stato</p>
                                <p className="font-semibold text-green-600">Attivo</p>
                            </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-2">Perché questo bando è adatto a te:</p>
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
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href={match.bando?.official_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Vai al bando →
                            </a>
                            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Salva per dopo
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mt-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                    Vuoi assistenza personalizzata per la candidatura?
                </h3>
                <p className="mb-6">
                    I nostri consulenti possono aiutarti a preparare tutta la documentazione necessaria
                </p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Richiedi consulenza gratuita
                </button>
            </div>
        </div>
    )
}

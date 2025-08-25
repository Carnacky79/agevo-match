'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CompanyFormData } from '@/types'
import { SECTORS, REGIONS, COMPANY_SIZES, INVESTMENT_GOALS } from '@/utils/constants'

interface CompanyFormProps {
    onSuccess: (companyId: string) => void
}

export function CompanyForm({ onSuccess }: CompanyFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CompanyFormData>({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        sector: 'tech',
        region: 'lombardia',
        companySize: 'small',
        investmentGoal: 'digitalization'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Save company profile
            const { data: company, error } = await supabase
                .from('companies')
                .insert({
                    company_name: formData.companyName,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    sector: formData.sector,
                    region: formData.region,
                    company_size: formData.companySize,
                    investment_goal: formData.investmentGoal
                })
                .select()
                .single()

            if (error) throw error

            // Generate matches
            await generateMatches(company.id)

            onSuccess(company.id)
        } catch (error) {
            console.error('Error:', error)
            alert('Errore nel salvataggio. Riprova.')
        } finally {
            setLoading(false)
        }
    }

    const generateMatches = async (companyId: string) => {
        // Get all active bandi
        const { data: bandi } = await supabase
            .from('bandi')
            .select('*')
            .eq('status', 'active')

        if (!bandi) return

        // Calculate matches
        const matches = []
        for (const bando of bandi) {
            const score = calculateMatchScore(formData, bando)
            if (score > 0) {
                matches.push({
                    company_id: companyId,
                    bando_id: bando.id,
                    match_score: score,
                    match_reasons: {
                        sector_match: bando.eligible_sectors.includes(formData.sector),
                        region_match: bando.eligible_regions.includes(formData.region),
                        size_match: bando.eligible_company_sizes.includes(formData.companySize),
                        goal_match: bando.eligible_investment_goals.includes(formData.investmentGoal)
                    }
                })
            }
        }

        // Save matches
        if (matches.length > 0) {
            await supabase.from('matches').insert(matches)
        }
    }

    const calculateMatchScore = (company: CompanyFormData, bando: any): number => {
        let score = 0

        // Check each criterion (25 points each)
        if (bando.eligible_sectors.includes(company.sector)) score += 25
        if (bando.eligible_regions.includes(company.region)) score += 25
        if (bando.eligible_company_sizes.includes(company.companySize)) score += 25
        if (bando.eligible_investment_goals.includes(company.investmentGoal)) score += 25

        return score
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inizia l'analisi gratuita</h2>
                <p className="text-gray-600 mt-2">Ricevi subito i tuoi primi 5 bandi compatibili</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email aziendale *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Company Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome azienda *</label>
                    <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Settore *</label>
                    <select
                        name="sector"
                        required
                        value={formData.sector}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {SECTORS.map(sector => (
                            <option key={sector.value} value={sector.value}>{sector.label}</option>
                        ))}
                    </select>
                </div>

                {/* Region */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regione *</label>
                    <select
                        name="region"
                        required
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {REGIONS.map(region => (
                            <option key={region.value} value={region.value}>{region.label}</option>
                        ))}
                    </select>
                </div>

                {/* Company Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensione aziendale *</label>
                    <select
                        name="companySize"
                        required
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {COMPANY_SIZES.map(size => (
                            <option key={size.value} value={size.value}>{size.label} - {size.description}</option>
                        ))}
                    </select>
                </div>

                {/* Investment Goal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Obiettivo di investimento *</label>
                    <select
                        name="investmentGoal"
                        required
                        value={formData.investmentGoal}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {INVESTMENT_GOALS.map(goal => (
                            <option key={goal.value} value={goal.value}>{goal.label}</option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Analisi in corso...' : 'Ricevi i tuoi 5 bandi gratuiti →'}
                </button>

                {/* Privacy note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 I tuoi dati sono protetti e non verranno mai condivisi
                </p>
            </form>
        </div>
    )
}

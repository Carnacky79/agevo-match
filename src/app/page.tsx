'use client'

import { useState } from 'react'
import { CompanyForm } from '@/components/forms/CompanyForm'
import { MatchResults } from '@/components/dashboard/MatchResults'

export default function Home() {
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFormSubmit = (id: string) => {
    setCompanyId(id)
    setShowResults(true)
  }

  if (showResults && companyId) {
    return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowResults(false)}
                >
                  <span className="text-2xl font-bold text-blue-600">AGEVO</span>
                  <span className="text-2xl font-bold text-gray-900 ml-2">MATCH</span>
                </div>
                <button
                    onClick={() => setShowResults(false)}
                    className="text-gray-600 hover:text-gray-900"
                >
                  ← Torna alla home
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <MatchResults companyId={companyId} />
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">AGEVO</span>
                <span className="text-2xl font-bold text-gray-900 ml-2">MATCH</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#come-funziona" className="text-gray-600 hover:text-gray-900 transition-colors">Come funziona</a>
                <a href="#vantaggi" className="text-gray-600 hover:text-gray-900 transition-colors">Vantaggi</a>
                <a href="#testimonianze" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonianze</a>
                <button
                    onClick={() => {
                      const formSection = document.querySelector('#form-section')
                      formSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Inizia ora →
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-20 pb-24 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Il ponte tra la tua impresa
                <span className="text-blue-600 block">e gli incentivi pubblici</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                AGEVO MATCH analizza il profilo della tua azienda e trova automaticamente
                tutti i bandi e gli incentivi compatibili. In tempo reale, senza burocrazia.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-12 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1.200+</div>
                  <div className="text-sm text-gray-600">Aziende servite</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">€127M</div>
                  <div className="text-sm text-gray-600">Incentivi disponibili</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-gray-600">Precisione matching</div>
                </div>
              </div>
            </div>

            {/* Dashboard Preview + Form */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Dashboard Preview */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">95% Match</span>
                        <span className="text-sm text-gray-500">Scade tra 15 giorni</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Voucher Digitalizzazione PMI</h3>
                      <p className="text-sm text-gray-600 mt-1">Fondo perduto fino a €25.000</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">87% Match</span>
                        <span className="text-sm text-gray-500">Scade tra 30 giorni</span>
                      </div>
                      <div className="text-sm text-gray-600">Credito d&apos;imposta R&amp;S</div>
                      <p className="text-sm text-gray-600 mt-1">Credito 20% su investimenti</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">76% Match</span>
                        <span className="text-sm text-gray-500">Sempre attivo</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Formazione 4.0</h3>
                      <p className="text-sm text-gray-600 mt-1">Formazione finanziata 50%</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg animate-pulse">
                  5 bandi gratis!
                </div>
              </div>

              {/* Form */}
              <div id="form-section">
                <CompanyForm onSuccess={handleFormSubmit} />
              </div>
            </div>
          </div>
        </section>

        {/* Come Funziona */}
        <section id="come-funziona" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Come funziona in 3 semplici passaggi
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Dalla profilazione al matching: il processo è completamente automatizzato
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Profila la tua azienda</h3>
                <p className="text-gray-600">
                  Inserisci i dati essenziali: settore, dimensione, localizzazione e obiettivi di investimento.
                  Bastano 3 minuti.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ricevi i tuoi match</h3>
                <p className="text-gray-600">
                  Il nostro algoritmo analizza oltre 2.400 bandi attivi e ti mostra solo quelli veramente
                  compatibili con il tuo profilo.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Candidati con un click</h3>
                <p className="text-gray-600">
                  Accedi alla documentazione ufficiale, contatta consulenti specializzati o ricevi assistenza
                  per la candidatura.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vantaggi */}
        <section id="vantaggi" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  Perché oltre <span className="text-blue-600">1.200 PMI</span><br/>
                  hanno scelto AGEVO MATCH?
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Matching istantaneo e preciso</h3>
                      <p className="text-gray-600">
                        L'algoritmo analizza 50+ parametri per garantirti solo bandi veramente compatibili,
                        con un tasso di precisione dell'89%.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Risparmia 15 ore a settimana</h3>
                      <p className="text-gray-600">
                        Stop alla ricerca manuale. AGEVO MATCH monitora continuamente nuovi bandi e ti
                        avvisa solo quando c'è un'opportunità rilevante.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Consulenza esperta inclusa</h3>
                      <p className="text-gray-600">
                        Non sei solo: i nostri consulenti ti guidano nella preparazione della documentazione
                        e aumentano le tue chance di successo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-8">I numeri parlano chiaro</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">€3.2M</div>
                    <div className="text-sm opacity-90">Finanziamenti ottenuti</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">2.400+</div>
                    <div className="text-sm opacity-90">Bandi monitorati</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">72h</div>
                    <div className="text-sm opacity-90">Tempo medio risposta</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">92%</div>
                    <div className="text-sm opacity-90">Clienti soddisfatti</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonianze */}
        <section id="testimonianze" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cosa dicono i nostri clienti
              </h2>
              <p className="text-xl text-gray-600">
                Storie di successo da tutta Italia
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Grazie ad AGEVO MATCH abbiamo ottenuto €45.000 di fondi per la digitalizzazione.
                  Il processo è stato velocissimo!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Marco Rossi</div>
                    <div className="text-sm text-gray-600">CEO, TechSolutions Srl</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Prima perdevo giorni a cercare bandi. Ora ricevo notifiche solo per quelli davvero
                  rilevanti. Un risparmio di tempo incredibile!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Laura Bianchi</div>
                    <div className="text-sm text-gray-600">CFO, Manifattura Milano</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'assistenza nella compilazione è stata fondamentale. Senza AGEVO MATCH non avremmo
                  mai ottenuto il finanziamento R&S."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Giuseppe Verdi</div>
                    <div className="text-sm text-gray-600">Founder, GreenTech SpA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Finale */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto a trovare i tuoi incentivi?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Unisciti alle oltre 1.200 aziende che hanno già scelto AGEVO MATCH.
              I primi 5 bandi sono gratuiti, senza impegno.
            </p>
            <button
                onClick={() => {
                  const formSection = document.querySelector('#form-section')
                  formSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Inizia l'analisi gratuita →
            </button>
            <p className="text-sm text-blue-100 mt-4">
              🔒 Nessuna carta di credito richiesta
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-white">AGEVO</span>
                  <span className="text-2xl font-bold text-blue-400 ml-2">MATCH</span>
                </div>
                <p className="text-sm">
                  Il ponte intelligente tra la tua impresa e gli incentivi pubblici.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Prodotto</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Come funziona</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Prezzi</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Azienda</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Chi siamo</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Legale</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Termini di servizio</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; 2025 AGEVO MATCH. Tutti i diritti riservati. | P.IVA 01234567890</p>
            </div>
          </div>
        </footer>
      </div>
  )
}

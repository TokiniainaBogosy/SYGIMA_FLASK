import { Link } from 'react-router-dom'
import { Check, ArrowLeft, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Gratuit',
    price: '0 Ar',
    period: '/mois',
    desc: 'Pour les petites équipes',
    features: ['Jusqu\'à 5 utilisateurs', '100 demandes/mois', 'Tableau de bord basique', 'Support email'],
    cta: 'Commencer',
    popular: false
  },
  {
    name: 'Pro',
    price: '145 000 Ar',
    period: '/mois',
    desc: 'Pour les équipes en croissance',
    features: ['Utilisateurs illimités', 'Demandes illimitées', 'Analytics avancés', 'API access', 'Support prioritaire'],
    cta: 'Essai gratuit 14j',
    popular: true
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    period: '',
    desc: 'Pour les grandes organisations',
    features: ['SSO & LDAP', 'Audit complet', 'Déploiement on-premise', 'SLA garanti', 'Account manager dédié'],
    cta: 'Nous contacter',
    popular: false
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tarifs simples</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Commencez gratuitement, évoluez selon vos besoins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl border ${plan.popular ? 'border-blue-600 shadow-xl' : 'border-gray-200'} bg-white p-8`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    <Zap className="w-3.5 h-3.5" />
                    Plus populaire
                  </span>
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{plan.desc}</p>
              
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-blue-600' : 'text-green-500'}`} />
                    {feat}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/login"
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
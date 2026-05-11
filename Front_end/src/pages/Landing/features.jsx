import { Package, ClipboardList, BarChart3, Shield, Zap, Users, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Package,
    title: 'Inventaire intelligent',
    desc: 'Visualisez votre stock en temps réel. Alertes automatiques, historique des mouvements, et gestion multi-sites.',
    details: ['Stock temps réel', 'Alertes seuil', 'Historique complet', 'Multi-sites']
  },
  {
    icon: ClipboardList,
    title: 'Workflow de demandes',
    desc: 'Soumission en 2 clics, validation hiérarchique, et suivi de statut transparent pour chaque demande.',
    details: ['Soumission rapide', 'Validation par rôle', 'Suivi de statut', 'Notifications']
  },
  {
    icon: BarChart3,
    title: 'Analytics & rapports',
    desc: 'Tableaux de bord personnalisés, export Excel/PDF, et indicateurs de performance clés.',
    details: ['Dashboard temps réel', 'Export données', 'KPIs automatisés', 'Prévisions']
  },
  {
    icon: Shield,
    title: 'Sécurité & conformité',
    desc: 'Authentification JWT, contrôle d\'accès par rôles, et traçabilité complète des actions.',
    details: ['JWT sécurisé', 'RBAC', 'Audit log', 'Conformité RGPD']
  },
]

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnalités</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez tout ce que Sygima peut faire pour votre gestion de matériel.</p>
        </div>

        <div className="space-y-8">
          {features.map((feat, i) => {
            const Icon = feat.icon
            const isEven = i % 2 === 0
            
            return (
              <div key={i} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 bg-white rounded-2xl border border-gray-200 p-8`}>
                <div className="lg:w-1/2 flex items-center justify-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feat.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feat.desc}</p>
                  <ul className="grid grid-cols-2 gap-3">
                    {feat.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <Zap className="w-4 h-4 text-blue-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { ArrowRight, Package, ClipboardList, BarChart3, Shield, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'Inventaire en temps réel',
    desc: 'Suivez votre stock de matériel avec une précision totale. Alertes automatiques en cas de seuil critique.'
  },
  {
    icon: ClipboardList,
    title: 'Demandes simplifiées',
    desc: 'Les employés soumettent des demandes en quelques clics. Workflow d\'approbation fluide et transparent.'
  },
  {
    icon: BarChart3,
    title: 'Tableaux de bord',
    desc: 'Visualisez les statistiques clés : demandes en cours, taux d\'approbation, alertes stock.'
  },
  {
    icon: Shield,
    title: 'Sécurisé par rôles',
    desc: 'Employé, Responsable, Magasinier, Admin. Chacun accède uniquement à ce dont il a besoin.'
  },
  {
    icon: Zap,
    title: 'Notifications instantanées',
    desc: 'Soyez alerté dès qu\'une demande est soumise, approuvée ou qu\'un stock est bas.'
  },
  {
    icon: Users,
    title: 'Multi-départements',
    desc: 'Gérez plusieurs départements avec des politiques de stock et d\'approbation distinctes.'
  }
]

const stats = [
  { value: '500+', label: 'Entreprises' },
  { value: '10k+', label: 'Demandes traitées' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '<2min', label: 'Temps moyen' },
]

export default function HomePage() {
  return (
    <div>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Nouvelle version 2.0 disponible
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Gérez votre inventaire <br />
            <span className="text-blue-600">sans friction</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sygima modernise la gestion de matériel : demandes, approbations, stock et livraisons — tout en un seul outil intuitif.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/features"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Voir les fonctionnalités
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une suite complète pour gérer le cycle de vie de votre matériel, de la demande à la livraison.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════ */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre gestion ?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Rejoignez les entreprises qui font confiance à Sygima pour leur inventaire.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Créer un compte gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
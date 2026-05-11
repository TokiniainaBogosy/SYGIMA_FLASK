import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, ClipboardList, BarChart3, Shield, Zap, Users, ChevronRight, Star, Play } from 'lucide-react'

// Hook pour animation au scroll
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

// Composant section animée
function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollReveal()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const stats = [
  { value: '500+', label: 'Entreprises' },
  { value: '10k+', label: 'Demandes traitées' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '<2min', label: 'Temps moyen' },
]

const features = [
  { icon: Package, title: 'Inventaire en temps réel', desc: 'Suivez votre stock avec précision. Alertes automatiques en cas de seuil critique.' },
  { icon: ClipboardList, title: 'Demandes simplifiées', desc: 'Soumission en 2 clics, workflow d\'approbation fluide et transparent.' },
  { icon: BarChart3, title: 'Tableaux de bord', desc: 'Visualisez les statistiques clés et prenez des décisions éclairées.' },
  { icon: Shield, title: 'Sécurisé par rôles', desc: 'Employé, Responsable, Magasinier, Admin. Chacun a son espace dédié.' },
  { icon: Zap, title: 'Notifications instantanées', desc: 'Soyez alerté en temps réel de chaque action importante.' },
  { icon: Users, title: 'Multi-départements', desc: 'Gérez plusieurs départements avec des politiques distinctes.' },
]

const testimonials = [
  { name: 'Marie L.', role: 'Responsable IT', company: 'TechCorp', text: 'Sygima a réduit nos temps de traitement de 70%. Un outil indispensable.', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Jean R.', role: 'Magasinier', company: 'LogiStock', text: 'Enfin une interface claire pour gérer les entrées et sorties de stock.', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Sophie M.', role: 'Directrice', company: 'InnoSoft', text: 'Le tableau de bord nous donne une visibilité totale sur nos ressources.', avatar: 'https://i.pravatar.cc/150?img=5' },
]

const steps = [
  { num: '01', title: 'Créez votre compte', desc: 'Inscription en 30 secondes, sans carte bancaire.' },
  { num: '02', title: 'Configurez votre stock', desc: 'Ajoutez vos matériels, catégories et seuils d\'alerte.' },
  { num: '03', title: 'Invitez votre équipe', desc: 'Attribuez les rôles et lancez vos premières demandes.' },
]

export default function HomePage() {
  return (
    <div>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
        {/* Cercles décoratifs animés */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-bounce">
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
            <Link to="/login" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/features" className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:-translate-y-0.5">
              Voir les fonctionnalités
            </Link>
          </div>

          {/* Stats animées */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Image mockup dashboard */}
          <AnimatedSection delay={400} className="mt-16">
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full" />
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop" 
                alt="Dashboard Sygima" 
                className="rounded-2xl shadow-2xl border border-gray-200 w-full"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <button className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                  <Play className="w-4 h-4 text-blue-600" />
                  Voir la démo en 2 min
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ LOGOS CLIENTS ══════════════════════════ */}
      <AnimatedSection className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['https://logo.clearbit.com/microsoft.com', 'https://logo.clearbit.com/google.com', 'https://logo.clearbit.com/amazon.com', 'https://logo.clearbit.com/airbnb.com', 'https://logo.clearbit.com/spotify.com'].map((logo, i) => (
              <img key={i} src={logo} alt="Client" className="h-8 object-contain hover:scale-110 transition-transform" />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ FEATURES ═══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une suite complète pour gérer le cycle de vie de votre matériel.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 bg-white">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ SECTION IMAGE + TEXTE (alternée) ═══════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Bloc 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <AnimatedSection className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-3xl rotate-2" />
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop" 
                  alt="Gestion de stock" 
                  className="relative rounded-2xl shadow-lg w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">+40%</p>
                    <p className="text-xs text-gray-500">Productivité</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="lg:w-1/2">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Inventaire intelligent</span>
              <h3 className="text-3xl font-bold text-gray-900 mt-3 mb-4">Ne manquez jamais une alerte stock</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Visualisez vos niveaux de stock en temps réel. Recevez des notifications automatiques dès qu'un matériel atteint son seuil critique. Anticipez vos réapprovisionnements.
              </p>
              <ul className="space-y-3">
                {['Alertes automatiques', 'Historique des mouvements', 'Gestion multi-sites'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-blue-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          {/* Bloc 2 (inversé) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <AnimatedSection className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-3xl -rotate-2" />
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop" 
                  alt="Workflow demandes" 
                  className="relative rounded-2xl shadow-lg w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">3 rôles</p>
                    <p className="text-xs text-gray-500">Workflow clair</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="lg:w-1/2">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Workflow fluide</span>
              <h3 className="text-3xl font-bold text-gray-900 mt-3 mb-4">De la demande à la livraison en 3 clics</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                L'employé soumet, le responsable approuve, le magasinier livre. Chaque étape est tracée, notifiée et sécurisée. Fini les emails perdus et les relances interminables.
              </p>
              <div className="flex gap-4">
                {['Soumission', 'Approbation', 'Livraison'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ══════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-gray-600">Lancez-vous en 3 étapes simples.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="relative p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                  <span className="text-5xl font-bold text-blue-100 group-hover:text-blue-200 transition-colors absolute top-4 right-4">
                    {step.num}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 relative">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed relative">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TÉMOIGNAGES ════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ils adorent Sygima</h2>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role} • {t.company}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ══════════════════════════════ */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à moderniser votre gestion ?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Rejoignez les entreprises qui font confiance à Sygima. Gratuit, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                Créer un compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/pricing" className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all">
                Voir les tarifs
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
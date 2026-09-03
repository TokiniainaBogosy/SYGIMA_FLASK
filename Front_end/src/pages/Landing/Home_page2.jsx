import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, Package, ClipboardList, BarChart3, Shield, Zap, Users,
  ChevronLeft, ChevronRight, Play, Pause, TrendingUp, Clock, Award,Boxes,CheckCircle,Lock
} from 'lucide-react'

// ═══ HOOK: Animation au scroll ═══════════════════════
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

// ═══ COMPOSANT: Section animée au scroll (CORRIGÉ) ═══
function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ═══ COMPOSANT: Compteur animé ═══════════════════════
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useScrollReveal()

  useEffect(() => {
    if (!visible) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// ═══ COMPOSANT: Carrousel d'images ═══════════════════
function ImageCarousel() {
  const images = [
    { 
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop', 
      caption: 'Gestion de stock en temps réel',
      desc: 'Visualisez vos niveaux de stock instantanément'
    },
    { 
      url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=500&fit=crop', 
      caption: 'Workflow de demandes',
      desc: 'Soumettez et suivez vos demandes facilement'
    },
    { 
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', 
      caption: 'Tableaux de bord intuitifs',
      desc: 'Prenez des décisions basées sur les données'
    },
    { 
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', 
      caption: 'Analytics avancés',
      desc: 'Suivez les performances de votre inventaire'
    },
  ]

  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPlaying, images.length])

  const goTo = (index) => setCurrent(index)
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length)
  const next = () => setCurrent((prev) => (prev + 1) % images.length)

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Images */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-gray-900">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={img.url} 
              alt={img.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">{img.caption}</h3>
              <p className="text-gray-300">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button onClick={next} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

// ═══ COMPOSANT: Section avec vidéo background ════════
// function VideoDemoSection() {
//   const [ref, visible] = useScrollReveal()
//   const [isPlaying, setIsPlaying] = useState(false)

//   return (
//     <section ref={ref} className="relative py-24 overflow-hidden">
//       {/* Vidéo background (simulée avec une image animée) */}
//       <div className="absolute inset-0">
//         <img 
//           src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop"
//           alt="Demo background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gray-900/85" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
//             <Play className="w-4 h-4" />
//             Voir la démo en action
//           </div>
          
//           <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
//             Simplifiez votre gestion <br />
//             <span className="text-blue-400">en quelques clics</span>
//           </h2>
          
//           <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12">
//             Découvrez comment Sygima transforme le quotidien de vos équipes avec un workflow fluide et intuitif.
//           </p>

//           {/* Mockup d'interface */}
//           <div className="relative max-w-4xl mx-auto">
//             <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
//               {/* Barre de fenêtre */}
//               <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
//                 <div className="w-3 h-3 rounded-full bg-red-500" />
//                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
//                 <div className="w-3 h-3 rounded-full bg-green-500" />
//                 <div className="ml-4 px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono">
//                   app.sygima.io/dashboard
//                 </div>
//               </div>
              
//               {/* Contenu mockup */}
//               <div className="p-6 grid grid-cols-3 gap-4">
//                 <div className="col-span-2 space-y-4">
//                   <div className="h-32 bg-gray-700/50 rounded-lg animate-pulse" />
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="h-24 bg-blue-500/20 rounded-lg border border-blue-500/30" />
//                     <div className="h-24 bg-green-500/20 rounded-lg border border-green-500/30" />
//                   </div>
//                   <div className="h-40 bg-gray-700/30 rounded-lg" />
//                 </div>
//                 <div className="space-y-4">
//                   <div className="h-20 bg-orange-500/20 rounded-lg border border-orange-500/30" />
//                   <div className="h-32 bg-gray-700/30 rounded-lg" />
//                   <div className="h-24 bg-purple-500/20 rounded-lg border border-purple-500/30" />
//                 </div>
//               </div>
//             </div>

//             {/* Badge flottant */}
//             <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce">
//               <TrendingUp className="w-4 h-4 inline mr-1" />
//               +47% d'efficacité
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
function DemoSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section ref={ref} className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6">
            <Play className="w-4 h-4" />
            Interface intuitive
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Gérez tout depuis <span className="text-blue-400">un seul écran</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tableau de bord, demandes, stock et validations — tout est là.
          </p>
        </div>

        {/* Mockup réaliste de l'app */}
        <div className={`transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl max-w-5xl mx-auto">
            
            {/* Barre de fenêtre navigateur */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono">
                  <Lock className="w-3 h-3" />
                  app.sygima.io/dashboard
                </div>
              </div>
            </div>

            {/* Contenu mockup SYGIMA */}
            <div className="p-4 grid grid-cols-12 gap-3">
              
              {/* Sidebar */}
              <div className="col-span-2 space-y-2">
                <div className="h-8 bg-blue-600 rounded-lg flex items-center px-3 gap-2">
                  <Boxes className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold">Sygima</span>
                </div>
                {['Dashboard', 'Demandes', 'Stock', 'Paramètres'].map((item, i) => (
                  <div key={i} className={`h-8 rounded-lg flex items-center px-3 gap-2 ${i === 0 ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500'}`}>
                    <div className="w-4 h-4 rounded bg-current opacity-50" />
                    <span className="text-xs">{item}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="col-span-10 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-4 w-32 bg-gray-600 rounded mb-1" />
                    <div className="h-3 w-48 bg-gray-700 rounded" />
                  </div>
                  <div className="h-8 w-24 bg-blue-600 rounded-lg" />
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { color: 'bg-blue-500', label: 'Stock' },
                    { color: 'bg-orange-500', label: 'Demandes' },
                    { color: 'bg-green-500', label: 'Approuvées' },
                    { color: 'bg-red-500', label: 'Alertes' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-3 w-16 bg-gray-600 rounded" />
                        <div className={`w-6 h-6 ${stat.color} rounded opacity-50`} />
                      </div>
                      <div className="h-6 w-12 bg-gray-500 rounded" />
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-gray-700/30 rounded-lg border border-gray-600/30 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-600/30 flex justify-between">
                    <div className="h-3 w-32 bg-gray-600 rounded" />
                    <div className="h-3 w-16 bg-gray-600 rounded" />
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-3 py-2.5 flex items-center gap-3 border-b border-gray-600/20 last:border-0">
                      <div className="h-3 w-20 bg-blue-500/30 rounded" />
                      <div className="h-3 w-24 bg-gray-600 rounded" />
                      <div className="h-3 w-16 bg-gray-700 rounded" />
                      <div className="ml-auto h-5 w-16 bg-green-500/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badge flottant */}
          <div className="absolute -top-2 right-8 bg-green-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-1.5 animate-bounce">
            <CheckCircle className="w-3.5 h-3.5" />
            En production chez ASECNA
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══ COMPOSANT: Stats animées ════════════════════════
function AnimatedStatsSection() {
  const [ref, visible] = useScrollReveal()

  const avantages = [
    { 
      icon: Shield, 
      title: 'Sécurisé', 
      desc: 'Authentification JWT & contrôle par rôles',
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      icon: Zap, 
      title: 'Rapide', 
      desc: 'Workflow optimisé de demande à livraison',
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      icon: BarChart3, 
      title: 'Transparent', 
      desc: 'Suivi en temps réel de chaque demande',
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      icon: Users, 
      title: 'Collaboratif', 
      desc: 'Multi-rôles : Employé, Resp., Magasinier, Admin',
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir Sygima ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une solution pensée pour les organisations qui veulent professionnaliser leur gestion de matériel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {avantages.map((item, i) => {
            const Icon = item.icon
            return (
              <div 
                key={i} 
                className={`group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ═══ COMPOSANT: Section image avec parallax ══════════
function ParallaxImageSection() {
  const [ref, visible] = useScrollReveal()
  const parallaxRef = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return
      const rect = parallaxRef.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * 0.1)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-100"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
          alt="Office"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-2xl transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Une solution pensée pour <br />
            <span className="text-blue-300">les équipes modernes</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Que vous soyez une startup en croissance ou une grande entreprise, Sygima s'adapte à vos besoins avec une flexibilité sans compromis sur la sécurité.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">Déploiement en 5 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm">Aucune formation requise</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-sm">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══ COMPOSANT: Témoignages ══════════════════════════
function TestimonialsSection() {
  const [ref, visible] = useScrollReveal()

//   const testimonials = [
//     {
//       name: 'Marie Dupont',
//       role: 'Responsable IT',
//       company: 'TechCorp',
//       text: 'Sygima a réduit notre temps de traitement des demandes de 70%. Un outil indispensable.',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
//     },
//     {
//       name: 'Jean Rakoto',
//       role: 'Magasinier',
//       company: 'IndustriePlus',
//       text: 'Enfin un outil qui comprend le workflow métier. Les alertes de stock me sauvent la vie.',
//       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
//     },
//     {
//       name: 'Sophie Martin',
//       role: 'Directrice des Opérations',
//       company: 'StartupXYZ',
//       text: 'Nous avons adopté Sygima en 2 semaines. L\'onboarding est fluide et l\'équipe adore.',
//       avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
//     }
//   ]
  const testimonials = [
  {
    name: 'Équipe ASECNA',
    role: 'Prototype en test',
    company: 'Madagascar',
    text: 'Sygima est actuellement en phase de déploiement interne. Les premiers retours sont encourageants.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  }
]

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez ce que nos utilisateurs disent de Sygima au quotidien.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className={`bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Zap key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role} • {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══ PAGE PRINCIPALE ════════════════════════════════
export default function HomePage() {
  const [heroRef, heroVisible] = useScrollReveal()

  const features = [
    {
      icon: Package,
      title: 'Inventaire en temps réel',
      desc: 'Suivez votre stock avec précision. Alertes automatiques en cas de seuil critique.'
    },
    {
      icon: ClipboardList,
      title: 'Demandes simplifiées',
      desc: 'Soumission en 2 clics, workflow d\'approbation fluide et transparent.'
    },
    {
      icon: BarChart3,
      title: 'Tableaux de bord',
      desc: 'Visualisez les statistiques clés : demandes, approbations, alertes stock.'
    },
    {
      icon: Shield,
      title: 'Sécurisé par rôles',
      desc: 'Employé, Responsable, Magasinier, Admin. Accès contrôlé pour chacun.'
    },
    {
      icon: Zap,
      title: 'Notifications instantanées',
      desc: 'Alertes en temps réel sur demandes et niveaux de stock.'
    },
    {
      icon: Users,
      title: 'Multi-départements',
      desc: 'Gérez plusieurs départements avec des politiques distinctes.'
    }
  ]

  return (
    <div>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
        {/* Particules animées (décor) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-200/30 animate-pulse"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Nouvelle version 2.0 disponible
            </div> */}
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Gérez votre inventaire <br />
              <span className="text-blue-600">sans friction</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sygima modernise la gestion de matériel : demandes, approbations, stock et livraisons — tout en un seul outil.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                state={{ fromModal: true }}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Voir les fonctionnalités
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CARROUSEL D'IMAGES ══════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">L'application en action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez l'interface intuitive de Sygima à travers ces captures.</p>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* ═══ VIDÉO DEMO BACKGROUND ══════════════════ */}
      <DemoSection />

      {/* ═══ STATS ANIMÉES ══════════════════════════ */}
      <AnimatedStatsSection />

      {/* ═══ PARALLAX IMAGE ═════════════════════════ */}
      <ParallaxImageSection />

      {/* ═══ FEATURES ═══════════════════════════════ */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une suite complète pour gérer le cycle de vie de votre matériel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div 
                  key={i} 
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section> */}

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
                      L'employé soumet, le responsable approuve. Chaque étape est tracée, notifiée et sécurisée. Fini les emails perdus et les relances interminables.
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

      {/* ═══ TÉMOIGNAGES ════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══ CTA FINAL ══════════════════════════════ */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre gestion ?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Rejoignez les entreprises qui font confiance à Sygima.
          </p>
          <Link
            to="/register"
            state={{ fromModal: true }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5"
          >
            Créer un compte gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
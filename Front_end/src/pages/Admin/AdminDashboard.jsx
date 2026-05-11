import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
// import AppHeader from '../components/layout/AppHeader'

export default function AdminDashBoard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }



   const stats = [
    {
      label: 'Matériels en stock',
      value: 156,
      // icon: '📦',
      color: 'bg-blue-500',
    },
    {
      label: 'Demandes en cours',
      value: 12,
      // icon: '📋',
      color: 'bg-orange-500',
    },
    {
      label: 'Demandes approuvées',
      value: 45,
      // icon: '✅',
      color: 'bg-green-500',
    },
    {
      label: 'Alertes stock',
      value: 3,
      // icon: '⚠️',
      color: 'bg-red-500',
    },
  ]

  // Fausses données pour le tableau (on les remplacera par des vraies)
  const dernieresDemandes = [
    {
      id: 1,
      reference: 'DEM-2025-001',
      demandeur: 'Rakoto Jean',
      departement: 'RSI',
      statut: 'APPROUVEE',
      date: '2025-01-15',
    },
    {
      id: 2,
      reference: 'DEM-2025-002',
      demandeur: 'Rasoa Marie',
      departement: 'MTO',
      statut: 'SOUMISE',
      date: '2025-01-16',
    },
    {
      id: 3,
      reference: 'DEM-2025-003',
      demandeur: 'Rabe Paul',
      departement: 'CNS',
      statut: 'REJETEE',
      date: '2025-01-17',
    },
    {
      id: 4,
      reference: 'DEM-2025-004',
      demandeur: 'Andry Luc',
      departement: 'TEL',
      statut: 'LIVREE',
      date: '2025-01-18',
    },
  ]

  // Fonction pour colorer le statut
  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'SOUMISE':
        return 'bg-blue-100 text-blue-800'
      case 'APPROUVEE':
        return 'bg-green-100 text-green-800'
      case 'REJETEE':
        return 'bg-red-100 text-red-800'
      case 'LIVREE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-orange-100 text-orange-800'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    // <div className="min-h-screen bg-gray-100">
      // <AppHeader/>
    
    <div>
      {/* Titre de bienvenue */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.prenom}   
        </h1>
        <p className="text-gray-500 mt-1">
          Voici un aperçu de votre espace de travail
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/*
          .map() = boucle sur chaque élément du tableau
          Pour chaque stat, on crée une carte
        */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des dernières demandes */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* En-tête du tableau */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Dernières demandes
          </h2>
        </div>

        {/* Contenu du tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* En-tête des colonnes */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Demandeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>

            {/* Lignes du tableau */}
            <tbody className="divide-y divide-gray-200">
              {dernieresDemandes.map((demande) => (
                <tr key={demande.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {demande.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {demande.demandeur}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {demande.departement}
                  </td>
                  <td className="px-6 py-4">
                    {/*
                      Badge coloré selon le statut
                      getStatutStyle() retourne les classes CSS
                    */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(demande.statut)}`}>
                      {demande.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {demande.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
  )
}
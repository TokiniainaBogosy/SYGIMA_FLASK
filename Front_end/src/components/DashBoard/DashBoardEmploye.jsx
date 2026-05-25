import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Download
} from 'lucide-react';
import DemandeMateriel from '../Formulaire/DemandeMatériel';

// ✅ PLUS DE SIDEBAR, on importe NAVBAR
// import Navbar from '../layout/NavBar2';
import StatCard from '../ui/StatCard';
import StatusBadge from '../ui/StatusBadge';
import DataTable from '../ui/DataTable';
import ActivityChart from '../charts/ActivityChart';
import StatsSection from '../stats/StatsSection';
import { useApi } from '../../hooks/useApi';

// ─── MOCK DATA ─────────────────────────────────────────────
const MOCK_DEMANDES = [
  { id: 1, reference: 'DEM-2024-001', demandeur: 'Jean Dupont', departement: 'IT', materiels: 'Ordinateur portable Dell XPS', statut: 'APPROUVEE', date: '2024-01-15' },
  { id: 2, reference: 'DEM-2024-002', demandeur: 'Marie Martin', departement: 'RH', materiels: 'Écran 27" LG', statut: 'SOUMISE', date: '2024-01-16' },
  { id: 3, reference: 'DEM-2024-003', demandeur: 'Paul Bernard', departement: 'Finance', materiels: 'Clavier mécanique Logitech', statut: 'LIVREE', date: '2024-01-14' },
  { id: 4, reference: 'DEM-2024-004', demandeur: 'Sophie Petit', departement: 'Marketing', materiels: 'Webcam 4K', statut: 'REJETEE', date: '2024-01-13' },
  { id: 5, reference: 'DEM-2024-005', demandeur: 'Lucas Moreau', departement: 'IT', materiels: 'Docking station USB-C', statut: 'SOUMISE', date: '2024-01-17' },
  { id: 6, reference: 'DEM-2024-006', demandeur: 'Emma Rousseau', departement: 'RH', materiels: 'Casque Jabra', statut: 'APPROUVEE', date: '2024-01-12' },
];



const MOCK_CHART_DATA = [
  { label: 'Lun', value: 12 },
  { label: 'Mar', value: 19 },
  { label: 'Mer', value: 8 },
  { label: 'Jeu', value: 25 },
  { label: 'Ven', value: 15 },
  { label: 'Sam', value: 5 },
  { label: 'Dim', value: 3 },
];
// ─────────────────────────────────────────────────────────────

export default function DashBoardEmploye() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false)

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // const [stats, setStats] = useState(null)
  const { data: stats, loading: statsLoading, error: statsError } = 
    useApi("/dashboard/stats")
  const { data: demandes, loading: demandesLoading, error: demandesError } = 
    useApi("/v1/demande/")
    // const STATS_DEMANDES = demandes.

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 800));
        // const token = localStorage.getItem("token")
        // const response = await fetch("http://localhost:8000/api/stats/dashboard", {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   }
        // })
        
        // // Si le serveur renvoie une erreur (401, 500...)
        // if (!response.ok) {
        //   throw new Error(`Erreur ${response.status}`)
        // }
        
        // const stats = await response.json()
        // setStats(stats)
        setData(demandes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);  // ← au lieu de logout() direct
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const quickStats = [
    { label: 'Matériels en stock', value: stats?.total_materiels ?? 0, icon: Package, color: 'blue', trend: 'up', trendValue: '+5%' },
    { label: 'Demandes en cours', value: stats?.total_demandes ?? 0, icon: ClipboardList, color: 'orange', trend: null, trendValue: '3 urgents' },
    { label: 'Demandes approuvées', value: stats?.demandes_approuvees ?? 0, icon: CheckCircle2, color: 'green', trend: 'up', trendValue: '+12%' },
    { label: 'Alertes stock', value: stats?.alertes_stock ?? 0, icon: AlertTriangle, color: 'red', trend: 'down', trendValue: '-1' },
  ];

  const tableColumns = [
    { header: 'Référence', key: 'reference', className: 'text-sm font-medium text-blue-600' },
    { header: 'Demandeur', key: 'demandeur' },
    { header: 'Département', key: 'departement', className: 'text-sm text-gray-500' },
    { header: 'Matériel', key: 'materiels', className: 'text-sm text-gray-500 max-w-xs truncate' },
    { 
      header: 'Statut', 
      key: 'statut',
      render: (row) => <StatusBadge status={row.statut} />
    },
    { header: 'Date', key: 'date', className: 'text-sm text-gray-500 font-mono' },
  ];

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }


  return (
   
    <div className="min-h-screen bg-gray-50">
      
      {/* ✅ NAVBAR EN HAUT */}
      {/* <Navbar onLogout={handleLogout} user={user} /> */}

      {/* ✅ CONTENU : plus besoin de flex-row, juste du padding-top */}
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"> */}
      <main className="w-full px-6 lg:px-10 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bonjour, {user?.prenom}
            </h1>
            <p className="text-gray-500 mt-1">
              Voici un aperçu de votre espace de travail
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"  onClick={() => setShowForm(!showForm)}>
              <ArrowUpRight className="w-4 h-4" />
              Nouvelle demande
            </button>
             
          </div>
        </div>
        {showForm && (
        <DemandeMateriel/>
    
      )}
      {statsLoading && (
          <div className="flex items-center justify-center py-12 bg-white rounded-xl border">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Chargement des statistiques...</span>
          </div>
        )}
        {statsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-800 font-medium">Erreur stats</p>
            <p className="text-red-600 text-sm">{statsError}</p>
          </div>
        )}

        {/* Stats rapides */}
       { !statsLoading && !statsError && stats && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>)}
        {demandesLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {demandesError && (
            <div className="px-6 py-8 text-center">
              <p className="text-red-600 font-medium">Erreur chargement demandes</p>
              <p className="text-sm text-gray-500">{demandesError}</p>
            </div>
          )}

        {/* Section milieu : Tableau + Graphique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
           {!demandesLoading && !demandesError && demandes && ( <DataTable
              data={demandes}
              columns={tableColumns}
              title="Dernières demandes"
              subtitle="Liste des demandes récentes"
              loading={demandesLoading}
              error={demandesError}
              maxRows={5}
            />)}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activité hebdomadaire</h2>
              <p className="text-sm text-gray-500 mt-0.5">Demandes par jour</p>
            </div>
            <div className="p-6">
              {stats?.activite_hebdo && (
  <ActivityChart data={stats.activite_hebdo} height={220} />
)}
            </div>
          </div>
        </div>

        {/* Grand bloc stats en bas */}
        <StatsSection data={demandes || []} type="demandes" />

      </main>
      {/* Overlay de confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirmer la déconnexion</h3>
            <p className="text-gray-500 mt-2">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------- */}
    </div>
  );
}
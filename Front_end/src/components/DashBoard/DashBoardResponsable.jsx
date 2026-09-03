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
import StatCard from '../ui/StatCard';
import StatusBadge from '../ui/StatusBadge';
import DataTable from '../ui/DataTable';
import ActivityChart from '../charts/ActivityChart';
import StatsSection from '../stats/StatsSection';
import { useApi } from '../../hooks/useApi';
import api from "../../services/api";
// Données affichées

export default function DashBoardResponsable() {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportPdfError, setExportPdfError] = useState("");

  const getPdfErrorMessage = async (error) => {
    const responseData = error.response?.data
    if (responseData instanceof Blob) {
      try {
        const body = JSON.parse(await responseData.text())
        return body.description || body.error || body.message
      } catch {
        return null
      }
    }
    return responseData?.description || responseData?.error || responseData?.message
  }

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setExportPdfError("");

    try {
      const response = await api.get("/dashboard/pdf", {
        responseType: "blob",
      });

      const blob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "rapport_dashboard.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    } catch (error) {
      console.error("Erreur lors de l'export du dashboard :", error);
      const message = await getPdfErrorMessage(error)
      setExportPdfError(message || "Impossible de générer le rapport PDF.");
    } finally {
      setIsExportingPdf(false);
    }
  }

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: stats, loading: statsLoading, error: statsError } =
    useApi("/dashboard/stats")
  const { data: demandes, loading: demandesLoading, error: demandesError } =
    useApi(`/demande/${user.departement_id}`)

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  // Noms de champs alignés sur la réponse réelle de get_dashboard_stats :
  // total_lignes_demandes_a_traiter, total_demandes_en_cours,
  // total_demandes_approuvees_cette_semaine, total_demandes_rejetees_cette_semaine,
  // total_materiels_stock_sortie_cette_semaine, activite_hebdo, alertes_stock
  const quickStats = [
    { label: 'Matériels sortie cette semaine', value: stats?.total_materiels_stock_sortie_cette_semaine ?? 0, icon: Package, color: 'navy', trend: null, trendValue: 'mouvements' },
    { label: 'Demandes en attente', value: stats?.total_demandes_en_attente_global ?? 0, icon: ClipboardList, color: 'orange', trend: null, trendValue: 'demandes' },
    { label: 'Demandes approuvées', value: stats?.total_demandes_approuvees_global ?? 0, icon: CheckCircle2, color: 'teal', trend: null, trendValue: 'cette période' },
    { label: 'Alertes stock', value: stats?.alertes_stock ?? 0, icon: AlertTriangle, color: 'red', trend: null, trendValue: 'sous le seuil' },
  ];

  const tableColumns = [
    { header: 'Référence', key: 'reference', className: 'text-sm font-medium text-[#58B2B0]' },
    { header: 'Demandeur', key: 'demandeur' },
    { header: 'Département', key: 'departement', className: 'text-sm text-gray-500' },
    { header: 'Matériel', key: 'materiels', className: 'text-sm text-gray-500 max-w-xs truncate' },
    {
      header: 'Statut',
      key: 'statut',
      render: (row) => <StatusBadge status={row.statut} />
    },
    { header: 'Date', key: 'date_soumission', className: 'text-sm text-gray-500 font-mono' },
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
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex h-10 min-w-30 items-center justify-center gap-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-wait transition-colors">
              <Download className="w-4 h-4" />
              {isExportingPdf ? "Export en cours..." : "Exporter"}
            </button>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D3056] text-white rounded-lg text-sm font-medium hover:bg-[#1e4e7e] transition-colors shadow-sm"
              onClick={() => setShowForm(!showForm)}>
              <ArrowUpRight className="w-4 h-4" />
              Nouvelle demande
            </button>
          </div>
        </div>

        {exportPdfError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {exportPdfError}
          </p>
        )}

        {showForm && <DemandeMateriel />}

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
        {!statsLoading && !statsError && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        )}

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
            {!demandesLoading && !demandesError && demandes && (
              <DataTable
                data={demandes}
                columns={tableColumns}
                title="Dernières demandes"
                subtitle="Liste des demandes récentes"
                loading={demandesLoading}
                error={demandesError}
                maxRows={5}
              />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activité hebdomadaire</h2>
              <p className="text-sm text-gray-500 mt-0.5">Demandes par jour</p>
            </div>
            <div className="p-6">
              {stats?.activite_hebdo?.length > 0 ? (
                <ActivityChart
                  data={stats.activite_hebdo}
                  height={220}
                />
              ) : (
                <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
                  Aucune activité à afficher
                </div>
              )}
            </div>

            {/* Matériel le plus demandé */}
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Matériel le plus demandé <span className="text-gray-400 font-normal">(sur l'année)</span>
              </h3>
              {stats?.materiels_plus_demandes?.length > 0 ? (
                <ul className="space-y-2">
                  {stats.materiels_plus_demandes.map((m, i) => (
                    <li key={m.materiel_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-[#8B939A] w-4 shrink-0">{i + 1}.</span>
                        <span className="text-gray-700 truncate">{m.designation}</span>
                      </div>
                      <span className="font-mono text-[#0D3056] font-medium shrink-0 ml-2">
                        {m.quantite_totale}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Aucune demande sur cette période</p>
              )}
            </div>
          </div>
        </div>

        {/* StatsSection fait maintenant son propre fetch vers /dashboard/stats
            (avec son sélecteur de période) — plus besoin de lui passer data/type */}
        <StatsSection />

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
    </div>
  );
}

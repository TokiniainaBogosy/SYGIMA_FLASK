import { useState } from 'react';
import {
  Package,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Loader2
} from 'lucide-react';
import StatCard from '../ui/StatCard';
import { useApi } from '../../hooks/useApi';

export default function StatsSection() {
  const [periode, setPeriode] = useState('semaine');

  // Le hook doit relancer la requête à chaque changement de `periode`
  // (vérifier que useApi a bien `url` en dépendance de son useEffect interne)
  const { data: stats, loading, error } = useApi(`/dashboard/stats?periode=${periode}`);

  const cards = stats ? [
    {
      label: 'Lignes à traiter',
      value: stats.total_lignes_demandes_a_traiter,
      icon: ClipboardList,
      color: 'navy',
      trend: null,
      trendValue: 'tous statuts actifs',
    },
    {
      label: 'En attente de stock',
      value: stats.total_demandes_en_cours,
      icon: Package,
      color: 'orange',
      trend: null,
      trendValue: 'bloquées',
    },
    {
      label: 'Lignes approuvées',
      value: stats.total_demandes_approuvees_cette_semaine,
      icon: CheckCircle2,
      color: 'teal',
      trend: null,
      trendValue: 'cette période',
    },
    {
      label: 'Lignes rejetées',
      value: stats.total_demandes_rejetees_cette_semaine,
      icon: AlertTriangle,
      color: 'red',
      trend: null,
      trendValue: 'cette période',
    },
    {
      label: 'Sorties matériel',
      value: stats.total_materiels_stock_sortie_cette_semaine,
      icon: TrendingDown,
      color: 'navy',
      trend: null,
      trendValue: 'mouvements',
    },
    {
      label: "Taux d'approbation",
      value: stats.taux_approbation !== null && stats.taux_approbation !== undefined
        ? `${stats.taux_approbation}%`
        : '—',
      icon: BarChart3,
      color: 'teal',
      trend: null,
      trendValue: 'lignes décidées',
    },
  ] : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Statistiques détaillées</h2>
          <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de l'activité</p>
        </div>
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="semaine">Cette semaine</option>
          <option value="mois">Ce mois</option>
          <option value="annee">Cette année</option>
        </select>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-500 text-sm">Chargement des statistiques...</span>
          </div>
        )}

        {error && !loading && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {!loading && !error && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { 
  Package, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import StatCard from '../ui/StatCard';

export default function StatsSection({ data, type = "demandes" }) {
  const stats = useMemo(() => {
    if (type === "demandes") {
      const total = data.length;
      const enCours = data.filter(d => d.statut === 'SOUMISE').length;
      const approuvees = data.filter(d => d.statut === 'APPROUVEE').length;
      const rejetees = data.filter(d => d.statut === 'REJETEE').length;
      const taux = total > 0 ? Math.round((approuvees / total) * 100) : 0;

      return [
        { label: 'Total demandes', value: total, icon: ClipboardList, color: 'blue', trend: 'up', trendValue: '+12%' },
        { label: 'En attente', value: enCours, icon: Package, color: 'orange', trend: null, trendValue: '3 urgents' },
        { label: 'Approuvées', value: approuvees, icon: CheckCircle2, color: 'green', trend: 'up', trendValue: '+8%' },
        { label: 'Rejetées', value: rejetees, icon: AlertTriangle, color: 'red', trend: 'down', trendValue: '-2%' },
        { label: 'Taux approbation', value: `${taux}%`, icon: BarChart3, color: 'purple', trend: null, trendValue: 'Objectif 85%' },
      ];
    }
    return [];
  }, [data, type]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Statistiques détaillées</h2>
          <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de l'activité</p>
        </div>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option>Cette semaine</option>
          <option>Ce mois</option>
          <option>Cette année</option>
        </select>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from 'react';
import { 
  Package, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3
} from 'lucide-react';
import StatCard from '../ui/StatCard';

export default function StatsSection({ data = [], type = "demandes" }) {
  // CORRECTION 1 : La valeur par défaut doit correspondre aux valeurs du select ('semaine')
  const [periode, setPeriode] = useState("semaine");

  const stats = useMemo(() => {
    if (type === "demandes") {
      // 1. Filtrage par date (basé sur le type datetime)
      const dataFiltreeParDate = data.filter(d => {
        // Choix de la date selon le statut de la ligne (soumission vs traitement)
        const dateBrute = d.statut === 'SOUMISE' ? d.date_soumission : d.date_traitement;
        if (!dateBrute) return false;
        
        const dateCible = new Date(dateBrute); 
        const limiteDate = new Date();

        if (periode === 'semaine') {
          limiteDate.setDate(limiteDate.getDate() - 7);
        } else if (periode === 'mois') {
          limiteDate.setMonth(limiteDate.getMonth() - 1);
        } else if (periode === 'annee') {
          limiteDate.setFullYear(limiteDate.getFullYear() - 1);
        }

        return dateCible >= limiteDate;
      });

      // 2. Élimination des doublons d'ID sur la période sélectionnée
      const vus = new Set();
      const dataUnique = dataFiltreeParDate.filter(d => !vus.has(d.id) && vus.add(d.id));

      // 3. Calculs des compteurs
      const total = dataUnique.length;
      const enCours = dataUnique.filter(d => d.statut === 'SOUMISE').length;
      const approuvees = dataUnique.filter(d => d.statut === 'APPROUVEE1').length;
      const rejetees = dataUnique.filter(d => d.statut === 'REJETEE1').length;
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
    // CORRECTION 2 : Ajout de 'periode' dans les dépendances pour relancer useMemo au changement de filtre
  }, [data, type, periode]);

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
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option value="semaine">Cette semaine</option>
          <option value="mois">Ce mois</option>
          <option value="annee">Cette année</option>
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
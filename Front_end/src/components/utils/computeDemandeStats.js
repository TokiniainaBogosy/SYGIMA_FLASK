export function computeDemandeStats(data = [], periode = "semaine") {
  const dataFiltreeParDate = data.filter(d => {
    const dateBrute = d.statut === 'SOUMISE' ? d.date_soumission : d.date_traitement;
    if (!dateBrute) return false;

    const dateCible = new Date(dateBrute);
    const limiteDate = new Date();

    if (periode === "semaine") limiteDate.setDate(limiteDate.getDate() - 7);
    if (periode === "mois") limiteDate.setMonth(limiteDate.getMonth() - 1);
    if (periode === "annee") limiteDate.setFullYear(limiteDate.getFullYear() - 1);

    return dateCible >= limiteDate;
  });

  const vus = new Set();
  const dataUnique = dataFiltreeParDate.filter(d => !vus.has(d.id) && vus.add(d.id));

  const total = dataUnique.length;
  const enCours = dataUnique.filter(d => d.statut === "SOUMISE").length;
  const approuvees = dataUnique.filter(d => d.statut === "APPROUVEE1").length;
  const rejetees = dataUnique.filter(d => d.statut === "REJETEE1").length;
  const taux = total > 0 ? Math.round((approuvees / total) * 100) : 0;

  return { total, enCours, approuvees, rejetees, taux };
}
// src/pages/PolitiqueConfidentialite.jsx
import React from 'react';

export default function PolitiqueConfidentialite() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'collecte', label: 'Collecte' },
    { id: 'finalite', label: 'Finalité' },
    { id: 'conservation', label: 'Conservation' },
    { id: 'droits', label: 'Vos droits' },
    { id: 'securite', label: 'Sécurité' },
    { id: 'tiers', label: 'Tiers' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-[#003366] text-white px-8 py-10 text-center">
          <h1 className="text-2xl font-semibold tracking-wide mb-2">
            Politique de confidentialité
          </h1>
          <p className="text-blue-100 text-sm">
            SYGIMA — Système de Gestion d'Inventaire et de Demandes de Matériel
          </p>
          <p className="text-blue-200 text-xs mt-1">
            ASECNA Madagascar & SARTM
          </p>
          
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded bg-white/10 text-white/90">
              Version 1.0
            </span>
        
            <span className="text-[10px] font-medium px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-100">
              Protection des données
            </span>
          </div>
        </div>

        {/* Sommaire */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="text-xs text-gray-600 hover:text-[#003366] hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="px-8 py-8 space-y-8">

          {/* 1. Introduction */}
          <section id="intro">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              1. Introduction
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                La présente politique de confidentialité décrit comment l'application <strong>SYGIMA</strong> collecte, 
                utilise, conserve et protège les données personnelles de ses utilisateurs. Elle s'applique à l'ensemble 
                des deux instances déployées :
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-xs mb-1"> Instance ASECNA (locale)</p>
                  <p className="text-xs text-gray-500 leading-5">
                    Déployée sur le serveur interne de l'ASECNA Madagascar. Responsable du traitement : ASECNA Madagascar — 
                    Direction des Systèmes d'Information (DSI).
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-xs mb-1">Instance SARTM (Simafri)</p>
                  <p className="text-xs text-gray-500 leading-5">
                    Déployée sur la plateforme Simafri. Responsable du traitement : SARTM — Syndicat Autonome pour 
                    le Rassemblement des Travailleurs Malagasy.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Chaque instance est autonome et gère ses propres données. Aucun échange de données n'est effectué 
                entre les deux instances.
              </p>
            </div>
          </section>

          {/* 2. Données collectées */}
          <section id="collecte">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              2. Données collectées
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Lors de la création de votre compte et de votre utilisation de SYGIMA, les données suivantes sont collectées :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li><strong>Identité :</strong> nom, prénom, adresse email professionnelle ou syndicale.</li>
              <li><strong>Appartenance :</strong> département (ASECNA) ou section syndicale (SARTM).</li>
              <li><strong>Rôle :</strong> Employé, Responsable, Magasinier/Gestionnaire de stock, Administrateur.</li>
              <li>
                <strong>Activité :</strong> demandes de matériel soumises, validations effectuées, signatures électroniques, 
                mouvements de stock enregistrés.
              </li>
              <li>
                <strong>Connexion :</strong> horodatage des connexions et actions sensibles (journal d'audit).
              </li>
        
            </ul>
          </section>

          {/* 3. Finalité */}
          <section id="finalite">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              3. Finalité du traitement
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Les données sont traitées exclusivement dans le but de :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>Gérer l'authentification et les sessions utilisateurs de manière sécurisée.</li>
              <li>Permettre la soumission, le suivi et le traitement des demandes de matériel.</li>
              <li>Assurer la traçabilité complète des entrées et sorties de stock.</li>
              <li>Générer des rapports et tableaux de bord statistiques par département ou par section.</li>
              <li>Envoyer des notifications liées au statut des demandes et aux alertes de stock.</li>
              <li>Maintenir un journal d'audit horodaté de toutes les actions sensibles.</li>
            </ul>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-800 leading-relaxed">
              <strong>Principe de minimisation :</strong> seules les données strictement nécessaires à la réalisation 
              de ces finalités sont collectées. Aucune donnée n'est utilisée à des fins commerciales ou publicitaires.
            </div>
          </section>

          {/* 4. Conservation */}
          <section id="conservation">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              4. Durée de conservation
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>
                <strong>Données de compte :</strong> conservées tant que le compte est actif. Suppression sur demande 
                ou à la fin du contrat / mandat.
              </li>
              <li>
                <strong>Demandes de matériel :</strong> conservées  à compter de la 
                clôture de la demande, pour des raisons de traçabilité et d'audit.
              </li>
              <li>
                <strong>Journal d'audit :</strong> conservé  à compter de 
                l'enregistrement de l'action.
              </li>
              <li>
                <strong>Signatures électroniques :</strong> conservées pendant la durée de conservation de la 
                demande associée.
              </li>
              <li>
                <strong>Données de connexion (logs) :</strong> conservées  à compter de l'enregistrement de la connexion, pour des raisons de sécurité et de détection d'incidents.
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Au terme de ces durées, les données sont soit anonymisées, soit supprimées de manière sécurisée.
            </p>
          </section>

          {/* 5. Droits */}
          <section id="droits">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              5. Vos droits
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Conformément à la législation malgache sur la protection des données personnelles, vous disposez 
              des droits suivants :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>
                <strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles détenues par 
                l'instance concernée.
              </li>
              <li>
                <strong>Droit de rectification :</strong> demander la correction de données inexactes ou incomplètes.
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> demander la suppression de vos données, sous réserve des 
                obligations légales de conservation.
              </li>
              <li>
                <strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes.
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et couramment utilisé.
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              Pour exercer ces droits, contactez l'administrateur de votre instance (ASECNA ou SARTM) par email ou 
              via le formulaire de contact de l'application. Votre demande sera traitée dans un délai maximum de{' '}
              <strong>30 jours</strong>.
            </p>
          </section>

          {/* 6. Sécurité */}
          <section id="securite">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              6. Mesures de sécurité
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              L'application SYGIMA met en œuvre les mesures techniques et organisationnelles suivantes pour 
              protéger vos données :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>
                <strong>Chiffrement des mots de passe :</strong> hashage bcrypt avec un coût ≥ 12.
              </li>
              <li>
                <strong>Authentification sécurisée :</strong> tokens JWT avec expiration configurable et 
                déconnexion automatique après inactivité.
              </li>
              <li>
                <strong>HTTPS :</strong> chiffrement des communications en production (certificat SSL sur Simafri).
              </li>
              <li>
                <strong>Validation des entrées :</strong> contrôles côté serveur pour prévenir les injections SQL 
                et les attaques XSS.
              </li>
              <li>
                <strong>Journal d'audit :</strong> enregistrement horodaté de toutes les actions sensibles avec 
                identification de l'acteur.
              </li>
              <li>
                <strong>Accès restreint :</strong> chaque utilisateur n'accède qu'aux données de son département 
                ou de sa section syndicale, selon son rôle.
              </li>
            </ul>
          </section>

          {/* 7. Tiers */}
          <section id="tiers">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              7. Absence de transmission à des tiers
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Vos données personnelles ne sont en aucun cas transmises, vendues, louées ou échangées avec des 
              tiers extérieurs. Seuls les administrateurs et gestionnaires de stock habilités de votre instance 
              ont accès aux données nécessaires à l'exercice de leurs fonctions.
            </p>
            <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-800 leading-relaxed">
              <strong>Isolation des instances :</strong> les données de l'instance ASECNA et celles de l'instance 
              SARTM sont stockées dans des bases de données distinctes et complètement isolées. Aucun croisement, 
              partage ou transfert de données entre les deux instances n'est réalisé.
            </div>
          </section>

          {/* 8. Contact */}
          <section id="contact">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              8. Contact et réclamations
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Pour toute question relative à la présente politique de confidentialité ou pour exercer vos droits :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>
                <strong>Instance ASECNA :</strong> contactez l'administrateur système ou la Direction des Systèmes 
                d'Information (DSI) de l'ASECNA Madagascar.
              </li>
              <li>
                <strong>Instance SARTM :</strong> contactez le responsable informatique du SARTM ou l'administrateur 
                de l'instance Simafri.
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              En cas de désaccord persistant, vous pouvez saisir l'autorité de protection des données compétente 
              à Madagascar.
            </p>
          </section>

        </div>

        {/* Pied de page */}
        <div className="bg-gray-50 px-8 py-5 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-5">
            Cette politique peut être modifiée à tout moment. Les utilisateurs seront informés de toute modification substantielle.<br />
            <span className="text-gray-500 font-medium">© 2026 ASECNA Madagascar & SARTM — Tous droits réservés.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
// src/pages/Conditions.jsx
import React from 'react';

export default function Conditions() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-[#003366] text-white px-8 py-10 text-center">
          <h1 className="text-2xl font-semibold tracking-wide mb-2">
            Conditions générales d'utilisation
          </h1>
          <p className="text-blue-100 text-sm">
            SYGIMA — Système de Gestion d'Inventaire et de Demandes de Matériel
          </p>
          <p className="text-blue-200 text-xs mt-1">
            ASECNA Madagascar & SARTM | Document confidentiel
          </p>
          
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded bg-white/10 text-white/90">
              Version 1.0
            </span>
            
            
            <span className="text-[10px] font-medium px-2.5 py-1 rounded bg-blue-400/20 text-blue-100">
              Accès ASECNA + SARTM
            </span>
          </div>
        </div>

        {/* Sommaire */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {['objet', 'acces', 'obligations', 'donnees', 'responsabilite', 'licence'].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-xs text-gray-600 hover:text-[#003366] hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer capitalize"
              >
                {id === 'donnees' ? 'Données' : id === 'responsabilite' ? 'Responsabilité' : id}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="px-8 py-8 space-y-8">

          {/* 1. Objet */}
          <section id="objet">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              1. Objet et périmètre d'utilisation
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Le présent document définit les conditions régissant l'utilisation de l'application{' '}
                <strong>SYGIMA</strong> (Système de Gestion d'Inventaire et de Demandes de Matériel), 
                développée dans le cadre d'un stage académique à l'ASECNA Madagascar.
              </p>
              <p>
                L'application est déployée en <strong>double instance</strong> :
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-xs mb-1">Instance locale ASECNA</p>
                  <p className="text-xs text-gray-500 leading-5">
                    Serveur interne du réseau ASECNA Madagascar. Gestion des stocks et demandes de matériel 
                    pour l'ensemble des départements techniques et administratifs.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="font-semibold text-gray-800 text-xs mb-1">Instance en ligne Simafri</p>
                  <p className="text-xs text-gray-500 leading-5">
                    Plateforme d'hébergement malgache. Accès réservé au{' '}
                    <strong>SARTM</strong> (Syndicat Autonome pour le Rassemblement des Travailleurs Malagasy) 
                    pour la gestion de leurs propres stocks et demandes de matériel.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Chaque instance dispose de sa propre base de données et de ses propres règles d'accès, 
                conformément aux présentes conditions.
              </p>
            </div>
          </section>

          {/* 2. Accès */}
          <section id="acces">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              2. Conditions d'accès
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p className="font-medium text-gray-700">Instance locale ASECNA :</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  L'accès est strictement <strong>réservé au personnel ASECNA Madagascar dûment habilité</strong>.
                </li>
                <li>
                  Chaque utilisateur se voit attribuer un compte nominatif rattaché à un département et un rôle 
                  spécifique (Employé, Responsable département, Magasinier ou Administrateur).
                </li>
                <li>Les identifiants sont strictement personnels et incessibles.</li>
              </ul>
              
              <p className="font-medium text-gray-700 mt-4">Instance en ligne SARTM (Simafri) :</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  L'accès est réservé aux <strong>membres du SARTM</strong> (Syndicat Autonome pour le Rassemblement 
                  des Travailleurs Malagasy) dûment enregistrés et validés par l'administrateur du syndicat.
                </li>
                <li>
                  Les comptes sont créés sur demande auprès du responsable informatique du SARTM ou de 
                  l'administrateur système.
                </li>
                <li>
                  Les rôles disponibles sont adaptés au fonctionnement du syndicat (Membre, Responsable syndical, 
                  Gestionnaire de stock SARTM, Administrateur).
                </li>
                <li>
                  Toute tentative d'accès non autorisé fera l'objet d'un signalement et sera consignée dans 
                  le journal d'audit.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Obligations */}
          <section id="obligations">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              3. Obligations de l'utilisateur
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
              <li>
                <strong>Confidentialité des identifiants :</strong> l'utilisateur s'engage à ne pas communiquer 
                ses identifiants à un tiers et à signaler toute suspicion de compromission.
              </li>
              <li>
                <strong>Usage conforme à l'instance :</strong> l'utilisateur de l'instance ASECNA ne peut utiliser 
                l'application que dans le cadre de ses missions professionnelles au sein de l'ASECNA Madagascar. 
                L'utilisateur de l'instance SARTM l'utilise dans le cadre de ses activités syndicales.
              </li>
              <li>
                <strong>Exactitude des données :</strong> l'utilisateur garantit l'exactitude des informations 
                saisies dans les formulaires de demande et d'inventaire.
              </li>
              <li>
                <strong>Respect du workflow :</strong> chaque utilisateur doit suivre le circuit de validation 
                défini pour les demandes de matériel.
              </li>
              <li>
                <strong>Séparation des instances :</strong> aucun utilisateur ne peut tenter d'accéder à une 
                instance pour laquelle il n'est pas habilité.
              </li>
            </ul>
          </section>

          {/* 4. Données */}
          <section id="donnees">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              4. Données personnelles et confidentialité
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p className="font-medium text-gray-700">Responsables du traitement :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Instance ASECNA :</strong> ASECNA Madagascar (Direction des Systèmes d'Information).
                </li>
                <li>
                  <strong>Instance SARTM :</strong> SARTM — Syndicat Autonome pour le Rassemblement des Travailleurs Malagasy.
                </li>
              </ul>
              <p>
                <strong>Données collectées :</strong> nom, prénom, adresse email, département ou section 
                d'appartenance, actions réalisées dans l'application (demandes, validations, signatures).
              </p>
              <p>
                <strong>Finalité :</strong> gestion des stocks et traçabilité des demandes de matériel, 
                selon l'instance concernée.
              </p>
              <p>
                <strong>Droits des utilisateurs :</strong> accès, rectification et suppression des données sur 
                demande auprès de l'administrateur de l'instance concernée.
              </p>
              <p className="bg-amber-50 text-amber-800 p-2.5 rounded-md text-xs font-medium">
                Les données de chaque instance sont strictement isolées. Aucune transmission de données entre 
                l'instance ASECNA et l'instance SARTM n'est effectuée.
              </p>
            </div>
          </section>

          {/* 5. Responsabilité */}
          <section id="responsabilite">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              5. Responsabilités et résiliation
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                L'ASECNA Madagascar et le SARTM mettent en œuvre les moyens nécessaires pour assurer la 
                disponibilité et la sécurité de leurs instances respectives. Toutefois, aucune des deux entités 
                ne saurait être tenue responsable en cas de dysfonctionnement lié à une utilisation non conforme 
                ou à une compromission des identifiants par l'utilisateur.
              </p>
              <p>L'accès peut être suspendu ou résilié à tout moment en cas de non-respect des présentes conditions :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Sur l'instance ASECNA : sur décision de l'administrateur système ou de la DSI.
                </li>
                <li>
                  Sur l'instance SARTM : sur décision du responsable informatique du SARTM ou de l'administrateur système.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Licence */}
          <section id="licence">
            <h2 className="text-[15px] font-semibold text-[#003366] mb-3 pb-2 border-b border-gray-200">
              6. Licence et propriété intellectuelle
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                L'application SYGIMA est développée dans le cadre d'un stage académique à l'ASECNA Madagascar. 
                La propriété intellectuelle du code source appartient conjointement aux auteurs et à l'ASECNA Madagascar.
              </p>
              <p>
                Le SARTM bénéficie d'une <strong>licence d'utilisation non exclusive</strong> pour l'instance 
                déployée sur Simafri, dans le strict cadre de ses activités syndicales.
              </p>
              <p>
                Toute reproduction, distribution ou utilisation commerciale est soumise à{' '}
                <strong>autorisation écrite préalable</strong>. Les auteurs conservent le droit de mentionner 
                ce projet dans leur portfolio professionnel.
              </p>
            </div>
          </section>

        </div>

        {/* Pied de page */}
        <div className="bg-gray-50 px-8 py-5 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-5">
            Droit applicable : droit malgache et réglementations ASECNA / SARTM.<br />
            Pour toute question relative aux présentes conditions, contactez l'administrateur de votre instance.<br />
            <span className="text-gray-500 font-medium">© 2026 ASECNA Madagascar & SARTM — Tous droits réservés.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
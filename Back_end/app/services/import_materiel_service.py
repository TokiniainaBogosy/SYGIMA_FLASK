import csv
import io

from app.database import db
from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.Materiel import Materiel, SousCategorieMateriel


def _lire_csv(file_storage):
    """Décode le fichier uploadé et détecte automatiquement le séparateur ; ou ,"""
    contenu = file_storage.read().decode("utf-8-sig")  # utf-8-sig gère le BOM d'Excel
    premiere_ligne = contenu.splitlines()[0] if contenu else ""
    separateur = ";" if ";" in premiere_ligne else ","
    return csv.DictReader(io.StringIO(contenu), delimiter=separateur)


def import_materiels(fichier, current_user, current_user_entreprise):
    """
    Importe des matériels depuis un fichier CSV
    (colonnes obligatoires: reference, designation, unite, categorie, sous_categorie).
    Retourne (created: int, errors: list[dict], materiels_crees: list[Materiel]).
    Lève une exception si le fichier est illisible ou si le commit échoue
    (à charge de la route de traduire en réponse HTTP appropriée).
    """
    lecteur = _lire_csv(fichier)
    colonnes_requises = {"reference", "designation", "unite", "categorie", "sous_categorie"}
    colonnes_presentes = set(lecteur.fieldnames or [])
    colonnes_manquantes = colonnes_requises - colonnes_presentes
    if colonnes_manquantes:
        raise ValueError(
            "Colonne(s) manquante(s) : " + ", ".join(sorted(colonnes_manquantes))
        )

    # Pré-charge les catégories accessibles (propres au département + globales)
    categories_dispo = CategoriesMateriel.query.filter(
        CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id,
        (CategoriesMateriel.departement_id == current_user.departement_id) | (CategoriesMateriel.is_global == True),
    ).all()
    categories_par_nom = {c.nom.strip().lower(): c for c in categories_dispo}

    created = 0
    errors = []
    materiels_crees = []

    for i, ligne in enumerate(lecteur, start=2):  # ligne 1 = en-tête
        reference = (ligne.get("reference") or "").strip()
        designation = (ligne.get("designation") or "").strip()
        unite = (ligne.get("unite") or "").strip()
        nom_categorie = (ligne.get("categorie") or "").strip()
        sous_categorie_brute = (ligne.get("sous_categorie") or "").strip().lower()

        if not reference or not designation or not unite:
            errors.append({"ligne": i, "message": "Référence, désignation ou unité manquante"})
            continue

        if sous_categorie_brute not in {"consommable", "equipement"}:
            errors.append({
                "ligne": i,
                "message": "Sous-catégorie invalide : utilisez 'consommable' ou 'equipement'",
            })
            continue

        categorie = categories_par_nom.get(nom_categorie.lower())
        if not categorie:
            errors.append({"ligne": i, "message": f"Catégorie '{nom_categorie}' introuvable"})
            continue

        deja_existant = Materiel.query.filter(
            Materiel.reference == reference,
            Materiel.entreprise_id == current_user_entreprise.entreprise_id,
        ).first()
        if deja_existant:
            errors.append({"ligne": i, "message": f"Référence '{reference}' déjà existante"})
            continue

        sous_categorie = SousCategorieMateriel(sous_categorie_brute)

        materiel = Materiel(
            reference=reference,
            designation=designation,
            unite=unite,
            categorie_id=categorie.id,
            entreprise_id=current_user_entreprise.entreprise_id,
            departement_id=current_user.departement_id,
            sous_categorie=sous_categorie,
            is_global=False,
        )
        db.session.add(materiel)
        created += 1
        materiels_crees.append(materiel)

    db.session.commit()  # après commit, chaque objet a bien son .id assigné

    return created, errors, materiels_crees
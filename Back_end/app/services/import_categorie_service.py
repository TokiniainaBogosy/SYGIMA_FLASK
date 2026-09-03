import csv
import io

from app.database import db
from app.models.CategoriesMateriel import CategoriesMateriel


def _lire_csv(file_storage):
    """Décode le fichier uploadé et détecte automatiquement le séparateur ; ou ,"""
    contenu = file_storage.read().decode("utf-8-sig")  # utf-8-sig gère le BOM d'Excel
    premiere_ligne = contenu.splitlines()[0] if contenu else ""
    separateur = ";" if ";" in premiere_ligne else ","
    return csv.DictReader(io.StringIO(contenu), delimiter=separateur)


def import_categories(fichier, current_user, current_user_entreprise):
    """
    Importe des catégories depuis un fichier CSV (colonnes: nom, description).
    Retourne (created: int, errors: list[dict], categories_creees: list[CategoriesMateriel]).
    Lève une exception si le fichier est illisible ou si le commit échoue
    (à charge de la route de traduire en réponse HTTP appropriée).
    """
    lecteur = _lire_csv(fichier)

    created = 0
    errors = []
    categories_creees = []

    for i, ligne in enumerate(lecteur, start=2):  # ligne 1 = en-tête
        nom = (ligne.get("nom") or "").strip()
        description = (ligne.get("description") or "").strip() or None

        if not nom:
            errors.append({"ligne": i, "message": "Nom manquant"})
            continue

        existe_deja = CategoriesMateriel.query.filter(
            CategoriesMateriel.nom == nom,
            CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id,
            CategoriesMateriel.departement_id == current_user.departement_id,
        ).first()
        if existe_deja:
            errors.append({"ligne": i, "message": f"Catégorie '{nom}' déjà existante"})
            continue

        categorie = CategoriesMateriel(
            nom=nom,
            description=description,
            entreprise_id=current_user_entreprise.entreprise_id,
            departement_id=current_user.departement_id,
            is_global=False,
        )
        db.session.add(categorie)
        created += 1
        categories_creees.append(categorie)

    db.session.commit()  # après commit, chaque objet a bien son .id assigné

    return created, errors, categories_creees
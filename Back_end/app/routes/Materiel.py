from flask import Blueprint, request, jsonify
from app.models.Stock import Stock
from app.schemas.categorie import CategorieBaseSchema, CategorieResponseSchemaAdmin, CategorieUpdateSchema, CategorieResponseSchema
from app.schemas.materiel import MaterielBaseSchema, MaterielResponseSchema, MaterielListResponseSchema, MaterielUpdateSchema
from app.schemas.stock import StockCreateSchema, StockUpdateSchema, StockResponseSchema, StockListResponseSchema
from app.schemas.inventaire import InventaireResponseSchema
from app.services.create_categorie_service import create_categorie
from app.services.read_categorie_service import read_categorie , read_categorie_par_admin
from app.services.create_materiel_service import create_materiel
from app.services.read_materiel_service import read_materiel, read_materiel_list
from app.services.create_stock_service import create_stock
from app.services.read_stock_list_service import read_stock_list , read_stock_list_par_admin
from app.services.delete_material_service import delete_materiel
from app.services.delete_categorie_service import delete_categorie
from app.services.delete_stock_service import delete_stock
from app.services.update_categorie_service import update_categorie
from app.services.update_materiel_service import update_materiel
from app.services.update_stock_service import update_stock
from app.services.read_stock_employe_service import read_inventaire_list, read_inventaire_list_par_admin
from app.utils.auth import get_current_user
from app.utils.auth import get_current_user_entreprise
from app.services.update_inventaire_service import update_inventaire
from app.utils.audit import inscrire_historique
from flask import send_file
from app.services.pdf.stock_pdf_service import generate_stock_pdf
from app.models.InventaireMaterielEmploye import InventaireEmploye
from app.services.pdf.inventaire_pdf_service import generate_inventaire_pdf
from app.models.CategoriesMateriel import CategoriesMateriel
from app.services.pdf.materiel_pdf_service import generate_materiel_pdf

materiel_bp = Blueprint("materiel", __name__, url_prefix="/materiel")


@materiel_bp.route("/categorie", methods=["POST"])
def create_categorie_route():
    data = CategorieBaseSchema().load(request.get_json())
    result = create_categorie(data,get_current_user_entreprise())
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
            action="CREATION",
            objet_cible=result,
            user_id=current_user.id,
            entreprise_id=current_user_entreprise.entreprise_id,  
            details={
                "nouveau_categorie": result.nom
            }
        )
    
    
    return jsonify(CategorieBaseSchema().dump(result)), 201


@materiel_bp.route("/materiel", methods=["POST"])
def create_materiel_route():
    data = MaterielBaseSchema().load(request.get_json())
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = create_materiel(data,current_user,current_user_entreprise)

    inscrire_historique(
                action="CREATION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "nouveau_materiel": result.designation
                }
            )
        
    return jsonify(MaterielResponseSchema().dump(result)), 201


@materiel_bp.route("/materiel", methods=["GET"])
def read_materiel_route():
    user_entreprise = get_current_user_entreprise()
    result = read_materiel(user_entreprise)
    return jsonify(MaterielResponseSchema(many=True).dump(result)), 200


@materiel_bp.route("/categorie", methods=["GET"])
def read_categorie_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_categorie(current_user_entreprise)
    return jsonify(CategorieResponseSchema(many=True).dump(result)), 200

@materiel_bp.route("/materiel/pdf", methods=["GET"])
def export_materiel_pdf():

    current_user_entreprise = get_current_user_entreprise()
    current_user = get_current_user()
    categories = CategoriesMateriel.query.filter(
        CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id,
        CategoriesMateriel.departement_id == current_user.departement_id
    ).all()

    entreprise = current_user_entreprise.entreprise

    pdf = generate_materiel_pdf(
        categories=categories,
        entreprise_nom=entreprise.nom
    )

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="catalogue_materiels.pdf"
    )

@materiel_bp.route("/categorie/admin", methods=["GET"])
def read_categorie_par_admin_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_categorie_par_admin(current_user_entreprise)
    return jsonify(CategorieResponseSchemaAdmin(many=True).dump(result)), 200


@materiel_bp.route("/stock", methods=["POST"])
def create_stock_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    data = StockCreateSchema().load(request.get_json())
    result, materiel = create_stock(data, current_user, current_user_entreprise)

    inscrire_historique(
                action="INSERTION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "materiel": materiel.designation,
                    "quantite": result.quantite_actuelle
                }
            )
    return jsonify(StockResponseSchema().dump(result)), 201


@materiel_bp.route("/stock/update/<int:stock_id>", methods=["PATCH"])
def update_stock_route(stock_id: int):
    data = StockUpdateSchema().load(request.get_json())
    db_obj, db_materiel = update_stock(stock_id, data)

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="MODIFICATION",
                objet_cible=db_obj,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "materiel": db_materiel.designation,
                    "nouvelle_quantite": db_obj.quantite_actuelle,
                    "quantite_ajoutee": data.get("quantite_ajoutee")
                }
            )
    return jsonify(StockResponseSchema().dump(db_obj)), 200


@materiel_bp.route("/stockList", methods=["GET"])
def read_stock_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_stock_list(current_user, current_user_entreprise)
    return jsonify(StockListResponseSchema(many=True).dump(result)), 200

@materiel_bp.route("/stockList/Admin", methods=["GET"])
def read_stock_list_par_admin_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_stock_list_par_admin(current_user_entreprise)
    return jsonify(StockListResponseSchema(many=True).dump(result)), 200


@materiel_bp.route("/materielList", methods=["GET"])
def read_materiel_list_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_materiel_list(current_user_entreprise)
    return jsonify(MaterielListResponseSchema(many=True).dump(result)), 200


@materiel_bp.route("/materiel/<int:materiel_id>", methods=["DELETE"])
def delete_materiel_route(materiel_id: int):
    result = delete_materiel(materiel_id)

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="SUPPRESSION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "materiel_supprimé": result.designation
                }
            )     
    return "", 204


@materiel_bp.route("/categorie/<int:categorie_id>", methods=["DELETE"])
def delete_categorie_route(categorie_id: int):
    result = delete_categorie(categorie_id)

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="SUPPRESSION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "categorie_supprimée": result.nom
                }
            ) 
    return "", 204

@materiel_bp.route("/stock/delete/<int:stock_id>", methods=["DELETE"])
def delete_stock_route(stock_id: int):
    result = delete_stock(stock_id)
   
    return "", 204


@materiel_bp.route("/categorie/update/<int:categorie_id>", methods=["PATCH"])
def update_categorie_route(categorie_id: int):
    data = CategorieUpdateSchema().load(request.get_json())
    result = update_categorie(categorie_id, data)
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="MODIFICATION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "nouvelle_categorie": result.nom,
                    "nouvelle_descrition": result.description
                }
            )
    return jsonify(CategorieResponseSchema().dump(result)), 200


@materiel_bp.route("/materiel/update/<int:materiel_id>", methods=["PATCH"])
def update_materiel_route(materiel_id: int):
    data = MaterielUpdateSchema().load(request.get_json())
    result = update_materiel(materiel_id, data)
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="MODIFICATION",
                objet_cible=result,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "nouveau_materiel": result.designation,
                    "nouvelle_categorie": result.categorie.nom,
                    "nouvelle_unite" : result.unite
                }
            )
        
    return jsonify(MaterielResponseSchema().dump(result)), 200

@materiel_bp.route("/inventaire", methods=["GET"])
def read_inventaire_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_inventaire_list(current_user, current_user_entreprise)
    return jsonify(InventaireResponseSchema(many=True).dump(result)), 200

@materiel_bp.route("/inventaire/pdf", methods=["GET"])
def export_inventaire_pdf():

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inventaires = InventaireEmploye.query.filter(
        InventaireEmploye.entreprise_id
        == current_user_entreprise.entreprise_id,

        InventaireEmploye.departement_id
        == current_user.departement_id
    ).all()

    entreprise = current_user_entreprise.entreprise
    departement = current_user.departement

    pdf = generate_inventaire_pdf(
        inventaires=inventaires,
        entreprise_nom=entreprise.nom,
        departement_nom=departement.nom
    )

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="rapport_inventaire.pdf"
    )

@materiel_bp.route("/inventaire/admin", methods=["GET"])
def read_inventaire_admin_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_inventaire_list_par_admin(current_user_entreprise)
    return jsonify(InventaireResponseSchema(many=True).dump(result)), 200

@materiel_bp.route("/inventaire/update/<int:inventaire_id>", methods=["PATCH"])
def update_inventaire_route(inventaire_id: int):
    data = request.get_json()
    db_obj, db_materiel = update_inventaire(inventaire_id, data)

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    inscrire_historique(
                action="MODIFICATION",
                objet_cible=db_obj,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "materiel": db_materiel.designation,
                    "nouvelle_quantite": db_obj.quantite,
                    "quantite_reduite": data.get("quantite_reduite")
                }
            )

    return jsonify(StockResponseSchema().dump(db_obj)), 200

@materiel_bp.route("/stock/pdf", methods=["GET"])
def export_stock_pdf():

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    stocks = Stock.query.filter(
        Stock.entreprise_id == current_user_entreprise.entreprise_id,
        Stock.departement_id == current_user.departement_id
    ).all()

    entreprise = current_user_entreprise.entreprise
    departement = current_user.departement

    pdf = generate_stock_pdf(
        stocks=stocks,
        entreprise_nom=entreprise.nom,
        departement_nom=departement.nom
    )

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="rapport_stock.pdf"
    )
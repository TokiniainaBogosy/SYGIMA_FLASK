from flask import Blueprint, request, jsonify
from app.schemas.categorie import CategorieBaseSchema, CategorieResponseSchema, CategorieUpdateSchema
from app.schemas.materiel import MaterielBaseSchema, MaterielResponseSchema, MaterielListResponseSchema, MaterielUpdateSchema
from app.schemas.stock import StockCreateSchema, StockUpdateSchema, StockResponseSchema, StockListResponseSchema
from app.services.create_categorie_service import create_categorie
from app.services.read_categorie_service import read_categorie
from app.services.create_materiel_service import create_materiel
from app.services.read_materiel_service import read_materiel, read_materiel_list
from app.services.create_stock_service import create_stock
from app.services.read_stock_list_service import read_stock_list
from app.services.delete_material_service import delete_materiel
from app.services.delete_categorie_service import delete_categorie
from app.services.update_categorie_service import update_categorie
from app.services.update_materiel_service import update_materiel
from app.services.update_stock_service import update_stock
from app.utils.auth import get_current_user
from app.utils.auth import get_current_user_entreprise

materiel_bp = Blueprint("materiel", __name__, url_prefix="/materiel")


@materiel_bp.route("/categorie", methods=["POST"])
def create_categorie_route():
    data = CategorieBaseSchema().load(request.get_json())
    result = create_categorie(data,get_current_user_entreprise())
    return jsonify(CategorieBaseSchema().dump(result)), 201


@materiel_bp.route("/materiel", methods=["POST"])
def create_materiel_route():
    data = MaterielBaseSchema().load(request.get_json())
    result = create_materiel(data, get_current_user_entreprise())
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


@materiel_bp.route("/stock", methods=["POST"])
def create_stock_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    data = StockCreateSchema().load(request.get_json())
    result = create_stock(data, current_user, current_user_entreprise)
    return jsonify(StockResponseSchema().dump(result)), 201


@materiel_bp.route("/stock/update/<int:stock_id>", methods=["PATCH"])
def update_stock_route(stock_id: int):
    data = StockUpdateSchema().load(request.get_json())
    result = update_stock(stock_id, data)
    return jsonify(StockResponseSchema().dump(result)), 200


@materiel_bp.route("/stockList", methods=["GET"])
def read_stock_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_stock_list(current_user, current_user_entreprise)
    return jsonify(StockListResponseSchema(many=True).dump(result)), 200


@materiel_bp.route("/materielList", methods=["GET"])
def read_materiel_list_route():
    current_user_entreprise = get_current_user_entreprise()
    result = read_materiel_list(current_user_entreprise)
    return jsonify(MaterielListResponseSchema(many=True).dump(result)), 200


@materiel_bp.route("/materiel/<int:materiel_id>", methods=["DELETE"])
def delete_materiel_route(materiel_id: int):
    delete_materiel(materiel_id)
    return "", 204


@materiel_bp.route("/categorie/<int:categorie_id>", methods=["DELETE"])
def delete_categorie_route(categorie_id: int):
    delete_categorie(categorie_id)
    return "", 204


@materiel_bp.route("/categorie/update/<int:categorie_id>", methods=["PATCH"])
def update_categorie_route(categorie_id: int):
    data = CategorieUpdateSchema().load(request.get_json())
    result = update_categorie(categorie_id, data)
    return jsonify(CategorieResponseSchema().dump(result)), 200


@materiel_bp.route("/materiel/update/<int:materiel_id>", methods=["PATCH"])
def update_materiel_route(materiel_id: int):
    data = MaterielUpdateSchema().load(request.get_json())
    result = update_materiel(materiel_id, data)
    return jsonify(MaterielResponseSchema().dump(result)), 200
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, socketio
from app.models.Notification import Notification, TypeNotification
from app.models.User import User
from app.models.Departement import Departement
from datetime import datetime
from sqlalchemy import desc, or_

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/my-notifications', methods=['GET'])
@jwt_required()
def get_my_notifications():
    """Récupérer MES notifications"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        print(f"User {current_user_id} (role: {user.role})")
        
        # Si RESPONSABLE: voir notifications de son département
        if user.role == 'responsable':
            departements = Departement.query.filter_by(
                responsable_id=current_user_id
            ).all()
            dept_ids = [d.id for d in departements]
            
            print(f"Responsable de {len(dept_ids)} département(s): {dept_ids}")
            
            notifications = Notification.query.filter(
                or_(
                    Notification.user_id == current_user_id,
                    Notification.departement_id.in_(dept_ids) if dept_ids else False
                )
            ).order_by(desc(Notification.created_at)).all()
        
        # Si EMPLOYÉ: voir uniquement SES notifications
        else:
            print(f"Employé")
            notifications = Notification.query.filter_by(
                user_id=current_user_id,
                is_read=False
            ).order_by(desc(Notification.created_at)).all()
        
        notifications_list = [n.to_dict() for n in notifications]
        
        print(f"{len(notifications_list)} notifications trouvées")
        
        return jsonify({
            'notifications': notifications_list,
            'count': len(notifications_list)
        }), 200
        
    except Exception as e:
        import traceback
        print(f"Erreur: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/create-for-responsable', methods=['POST'])
@jwt_required()
def create_notification_for_responsable():
    """Un employé envoie une notification à son responsable"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        if not user.departement_id:
            return jsonify({'error': 'Vous n\'êtes pas assigné à un département'}), 400
        
        # Récupérer le département et son responsable
        departement = Departement.query.get(user.departement_id)
        
        if not departement:
            return jsonify({'error': 'Département non trouvé'}), 404
            
        if not departement.responsable_id:
            return jsonify({'error': 'Ce département n\'a pas de responsable'}), 400
        
        data = request.json
        
        # Type de notification
        type_mapping = {
            'info': TypeNotification.INFO,
            'warning': TypeNotification.WARNING,
            'error': TypeNotification.ERROR,
            'success': TypeNotification.SUCCESS
        }
        notif_type = type_mapping.get(data.get('type', 'info').lower(), TypeNotification.INFO)
        
        # Créer la notification
        notification = Notification(
            user_id=departement.responsable_id,  # Destinataire
            sender_id=current_user_id,            # Émetteur
            entreprise_id=user.entreprise_id,
            departement_id=user.departement_id,
            message=data.get('message', 'Nouvelle notification'),
            type=notif_type
        )
        
        db.session.add(notification)
        db.session.commit()
        
        notification_dict = notification.to_dict()
        
        # Envoyer via Socket.IO
        room = f"user_{departement.responsable_id}"
        socketio.emit('new_notification', notification_dict, room=room)
        
        print(f'Notification envoyée de {user.username} au responsable (user {departement.responsable_id})')
        
        return jsonify({
            'success': True,
            'notification': notification_dict
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f'Erreur: {str(e)}')
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/create-for-department', methods=['POST'])
@jwt_required()
def create_notification_for_department():
    """Le responsable envoie une notification à tous ses employés"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        if user.role != 'responsable':
            return jsonify({'error': 'Accès réservé aux responsables'}), 403
        
        data = request.json
        departement_id = data.get('departementId')
        
        if not departement_id:
            return jsonify({'error': 'departementId requis'}), 400
        
        # Vérifier que l'utilisateur est le responsable
        departement = Departement.query.filter_by(
            id=departement_id,
            responsable_id=current_user_id
        ).first()
        
        if not departement:
            return jsonify({'error': 'Vous n\'êtes pas responsable de ce département'}), 403
        
        # Récupérer tous les employés
        employes = User.query.filter_by(departement_id=departement_id).all()
        
        if not employes:
            return jsonify({'error': 'Aucun employé dans ce département'}), 404
        
        type_mapping = {
            'info': TypeNotification.INFO,
            'warning': TypeNotification.WARNING,
            'error': TypeNotification.ERROR,
            'success': TypeNotification.SUCCESS
        }
        notif_type = type_mapping.get(data.get('type', 'info').lower(), TypeNotification.INFO)
        
        notifications_created = []
        
        # Créer une notification pour chaque employé
        for employe in employes:
            notification = Notification(
                user_id=employe.id,
                sender_id=current_user_id,
                entreprise_id=user.entreprise_id,
                departement_id=departement_id,
                message=data.get('message', 'Nouvelle notification'),
                type=notif_type
            )
            
            db.session.add(notification)
            db.session.flush()
            
            notification_dict = notification.to_dict()
            notifications_created.append(notification_dict)
            
            # Envoyer en temps réel
            room = f"user_{employe.id}"
            socketio.emit('new_notification', notification_dict, room=room)
        
        db.session.commit()
        
        print(f'{len(notifications_created)} notifications envoyées au département {departement_id}')
        
        return jsonify({
            'success': True,
            'notifications': notifications_created,
            'count': len(notifications_created)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f'Erreur: {str(e)}')
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notif_id):
    """Marquer une notification comme lue"""
    try:
        current_user_id = get_jwt_identity()
        notification = Notification.query.get(notif_id)
        
        if not notification:
            return jsonify({'error': 'Notification non trouvée'}), 404
        
        # Vérifier l'autorisation
        if notification.user_id != current_user_id:
            return jsonify({'error': 'Non autorisé'}), 403
        
        notification.is_read = True
        db.session.commit()
        
        print(f'Notification {notif_id} marquée comme lue')
        
        return jsonify({
            'success': True,
            'notification': notification.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Erreur: {str(e)}')
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """Marquer toutes les notifications comme lues"""
    try:
        current_user_id = get_jwt_identity()
        
        notifications = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).all()
        
        for notif in notifications:
            notif.is_read = True
        
        db.session.commit()
        
        print(f'{len(notifications)} notifications marquées comme lues')
        
        return jsonify({
            'success': True,
            'marked': len(notifications)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Erreur: {str(e)}')
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Nombre de notifications non lues"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        if user.role == 'responsable':
            departements = Departement.query.filter_by(
                responsable_id=current_user_id
            ).all()
            dept_ids = [d.id for d in departements]
            
            count = Notification.query.filter(
                Notification.is_read == False,
                or_(
                    Notification.user_id == current_user_id,
                    Notification.departement_id.in_(dept_ids) if dept_ids else False
                )
            ).count()
        else:
            count = Notification.query.filter_by(
                user_id=current_user_id,
                is_read=False
            ).count()
        
        return jsonify({
            'userId': current_user_id,
            'unreadCount': count
        }), 200
        
    except Exception as e:
        print(f'Erreur: {str(e)}')
        return jsonify({'error': str(e)}), 500
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, socketio
from app.models.Notification import Notification, TypeNotification
from datetime import datetime
from sqlalchemy import desc

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    """Récupérer les notifications d'un utilisateur"""
    try:
        print(f"📥 Récupération notifications pour user {user_id}")
        
        # Récupérer les notifications depuis la base de données
        notifications = Notification.query.filter_by(user_id=user_id).order_by(
            desc(Notification.created_at)
        ).all()
        
        notifications_list = [
            {
                'id': n.id,
                'userId': n.user_id,
                'entrepriseId': n.entreprise_id,
                'message': n.message,
                'type': n.type.value.lower(),  # Convertir INFO -> info
                'read': n.is_read,
                'timestamp': n.created_at.isoformat()
            }
            for n in notifications
        ]
        
        print(f"✅ {len(notifications_list)} notifications trouvées")
        
        return jsonify({
            'notifications': notifications_list,
            'count': len(notifications_list)
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur récupération notifications: {str(e)}")
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/create', methods=['POST'])
def create_notification():
    """Créer une nouvelle notification"""
    try:
        data = request.json
        print(f"📬 Création notification: {data}")
        
        # Mapper le type (info -> INFO)
        type_mapping = {
            'info': TypeNotification.INFO,
            'warning': TypeNotification.WARNING,
            'error': TypeNotification.ERROR,
            'success': TypeNotification.INFO  # success -> INFO
        }
        
        notif_type = type_mapping.get(data.get('type', 'info').lower(), TypeNotification.INFO)
        
        # Créer la notification
        notification = Notification(
            user_id=data.get('userId'),
            entreprise_id=data.get('entrepriseId'),
            message=data.get('message', 'Nouvelle notification'),
            type=notif_type
        )
        
        db.session.add(notification)
        db.session.commit()
        
        # Convertir pour l'envoi
        notification_dict = {
            'id': notification.id,
            'userId': notification.user_id,
            'entrepriseId': notification.entreprise_id,
            'message': notification.message,
            'type': notification.type.value.lower(),
            'read': notification.is_read,
            'timestamp': notification.created_at.isoformat()
        }
        
        # Envoyer en temps réel via Socket.IO
        room = f"user_{notification.user_id}"
        socketio.emit('new_notification', notification_dict, room=room)
        
        print(f'✅ Notification créée et envoyée à {room}')
        
        return jsonify({
            'success': True,
            'notification': notification_dict
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f'❌ Erreur création notification:', str(e))
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<int:notif_id>/read', methods=['PUT'])
def mark_as_read(notif_id):
    """Marquer une notification comme lue"""
    try:
        notification = Notification.query.get(notif_id)
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        notification.is_read = True
        db.session.commit()
        
        print(f'✅ Notification {notif_id} marquée comme lue')
        
        return jsonify({
            'success': True,
            'notification': {
                'id': notification.id,
                'userId': notification.user_id,
                'entrepriseId': notification.entreprise_id,
                'message': notification.message,
                'type': notification.type.value.lower(),
                'read': notification.is_read,
                'timestamp': notification.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'❌ Erreur marquage notification: {str(e)}')
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/mark-all-read/<int:user_id>', methods=['PUT'])
def mark_all_as_read(user_id):
    """Marquer toutes les notifications comme lues"""
    try:
        notifications = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).all()
        
        count = 0
        for notif in notifications:
            notif.is_read = True
            count += 1
        
        db.session.commit()
        
        print(f'✅ {count} notifications marquées comme lues pour user {user_id}')
        return jsonify({'success': True, 'marked': count}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'❌ Erreur marquage toutes notifications: {str(e)}')
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/test/<int:user_id>', methods=['POST'])
def test_notification(user_id):
    """Route de test pour envoyer une notification"""
    try:
        data = request.json or {}
        entreprise_id = data.get('entrepriseId', 1)  # ID par défaut
        
        notification = Notification(
            user_id=user_id,
            entreprise_id=entreprise_id,
            message=f'🔔 Test notification en temps réel ! ({datetime.now().strftime("%H:%M:%S")})',
            type=TypeNotification.INFO
        )
        
        db.session.add(notification)
        db.session.commit()
        
        notification_dict = {
            'id': notification.id,
            'userId': notification.user_id,
            'entrepriseId': notification.entreprise_id,
            'message': notification.message,
            'type': notification.type.value.lower(),
            'read': notification.is_read,
            'timestamp': notification.created_at.isoformat()
        }
        
        room = f"user_{user_id}"
        socketio.emit('new_notification', notification_dict, room=room)
        
        print(f'📬 Test notification envoyée à {room}')
        
        return jsonify({
            'success': True,
            'notification': notification_dict,
            'room': room
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'❌ Erreur test notification: {str(e)}')
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/unread-count/<int:user_id>', methods=['GET'])
def get_unread_count(user_id):
    """Récupérer le nombre de notifications non lues"""
    try:
        count = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).count()
        
        return jsonify({
            'userId': user_id,
            'unreadCount': count
        }), 200
        
    except Exception as e:
        print(f'❌ Erreur comptage notifications: {str(e)}')
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/all', methods=['GET'])
def get_all_notifications():
    """Debug: récupérer toutes les notifications"""
    try:
        notifications = Notification.query.order_by(
            desc(Notification.created_at)
        ).all()
        
        notifications_list = [
            {
                'id': n.id,
                'userId': n.user_id,
                'entrepriseId': n.entreprise_id,
                'message': n.message,
                'type': n.type.value.lower(),
                'read': n.is_read,
                'timestamp': n.created_at.isoformat()
            }
            for n in notifications
        ]
        
        return jsonify({
            'notifications': notifications_list,
            'count': len(notifications_list)
        }), 200
        
    except Exception as e:
        print(f'❌ Erreur récupération toutes notifications: {str(e)}')
        return jsonify({'error': str(e)}), 500
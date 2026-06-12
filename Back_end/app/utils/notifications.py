from app import db, socketio
from app.models.Notification import Notification, TypeNotification

def send_notification(user_id, entreprise_id, message, notification_type='info'):
    """
    Envoyer une notification à un utilisateur
    
    Args:
        user_id (int): ID de l'utilisateur
        entreprise_id (int): ID de l'entreprise
        message (str): Message de la notification
        notification_type (str): Type (info, warning, error)
    
    Returns:
        Notification: L'objet notification créé
    """
    # Mapper le type
    type_mapping = {
        'info': TypeNotification.INFO,
        'warning': TypeNotification.WARNING,
        'error': TypeNotification.ERROR,
        'success': TypeNotification.INFO
    }
    
    notif_type = type_mapping.get(notification_type.lower(), TypeNotification.INFO)
    
    # Créer la notification
    notification = Notification(
        user_id=user_id,
        entreprise_id=entreprise_id,
        message=message,
        type=notif_type
    )
    
    db.session.add(notification)
    db.session.commit()
    
    # Convertir pour l'envoi Socket.IO
    notification_dict = {
        'id': notification.id,
        'userId': notification.user_id,
        'entrepriseId': notification.entreprise_id,
        'message': notification.message,
        'type': notification.type.value.lower(),
        'read': notification.is_read,
        'timestamp': notification.created_at.isoformat()
    }
    
    # Envoyer en temps réel
    room = f"user_{user_id}"
    socketio.emit('new_notification', notification_dict, room=room)
    
    print(f'📬 Notification envoyée à user {user_id}: {message}')
    
    return notification
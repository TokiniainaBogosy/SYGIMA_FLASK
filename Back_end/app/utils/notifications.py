from app import db, socketio
from app.models.Notification import Notification, TypeNotification


def send_notification(
    user_id,
    entreprise_id,
    message,
    notification_type='info',
    departement_id=None,
    sender_id=None
):
    type_mapping = {
        'info': TypeNotification.INFO,
        'warning': TypeNotification.WARNING,
        'error': TypeNotification.ERROR,
        'success': TypeNotification.SUCCESS
    }

    notif_type = type_mapping.get(
        notification_type.lower(),
        TypeNotification.INFO
    )

    notification = Notification(
        user_id=user_id,
        entreprise_id=entreprise_id,
        departement_id=departement_id,   # ✅
        sender_id=sender_id,             # ✅
        message=message,
        type=notif_type
    )

    db.session.add(notification)
    db.session.commit()

    notification_dict = notification.to_dict()

    room = f"user_{user_id}"
    socketio.emit('new_notification', notification_dict, room=room)

    print(f'📬 Notification envoyée à user {user_id}: {message}')

    return notification
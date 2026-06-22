from flask_socketio import emit, join_room, leave_room
from flask import request

# Stockage des utilisateurs connectés
connected_users = {}

def register_socket_events(socketio):
    """Enregistrer tous les événements Socket.IO"""
    
    @socketio.on('connect')
    def handle_connect():
        print(f'Client connecté: {request.sid}')
        emit('connection_response', {
            'status': 'connected',
            'sid': request.sid
        })
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f'Client déconnecté: {request.sid}')
        # Retirer l'utilisateur des connectés
        for user_id, sid in list(connected_users.items()):
            if sid == request.sid:
                del connected_users[user_id]
                print(f'User {user_id} déconnecté')
                break
    
    @socketio.on('join')
    def on_join(data):
        user_id = data.get('userId')
        room = f"user_{user_id}"
        join_room(room)
        connected_users[user_id] = request.sid
        print(f'User {user_id} rejoint room {room} (SID: {request.sid})')
        emit('joined', {'room': room, 'userId': user_id})
    
    @socketio.on('leave')
    def on_leave(data):
        user_id = data.get('userId')
        room = f"user_{user_id}"
        leave_room(room)
        if user_id in connected_users:
            del connected_users[user_id]
        print(f'User {user_id} a quitté room {room}')
        emit('left', {'room': room, 'userId': user_id})
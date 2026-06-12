from app import create_app, socketio
from flask_cors import CORS
from flask import jsonify

app = create_app()

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "SYGIMA API is running"})

# Route de debug pour lister toutes les routes
@app.route("/debug/routes", methods=["GET"])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'path': str(rule)
        })
    return jsonify(routes)

if __name__ == "__main__":
    print('🚀 Démarrage du serveur Flask avec Socket.IO...')
    print('📡 URL: http://localhost:8000')
    print('🔌 WebSocket: ws://localhost:8000')
    
    socketio.run(
        app,
        host="0.0.0.0",
        port=8000,
        debug=True,
        allow_unsafe_werkzeug=True
    )
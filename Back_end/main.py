from app import create_app
from flask_cors import CORS
from flask import jsonify

app = create_app()

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "SYGIMA API is running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
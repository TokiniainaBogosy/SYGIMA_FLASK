from app import create_app, socketio

app = create_app()

with app.app_context():
    print("\n=== ROUTES ENREGISTRÉES ===")
    for rule in app.url_map.iter_rules():
        if 'notification' in str(rule):
            print(f"{rule} -> {rule.endpoint} [{', '.join(rule.methods)}]")
    
    print("\n=== BLUEPRINTS ===")
    for bp_name, bp in app.blueprints.items():
        print(f"{bp_name}: {bp.url_prefix}")
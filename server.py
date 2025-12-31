from flask import Flask, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.')
UPLOAD_DIR = 'uploads'

# Pastikan folder uploads ada
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return "File not found", 404

@app.route('/files', methods=['GET'])
def list_files():
    try:
        files = os.listdir(UPLOAD_DIR)
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['pdf_file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = file.filename
        # Basic validation (optional)
        if not filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files allowed"}), 400
            
        file.save(os.path.join(UPLOAD_DIR, filename))
        return jsonify({"message": "File uploaded successfully", "filename": filename}), 200

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.get_json()
    filename = data.get('filename')
    
    if not filename:
        return jsonify({"error": "Filename required"}), 400
        
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
            return jsonify({"message": "File deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    print("Server running on http://localhost:8000")
    app.run(port=8000, debug=True)

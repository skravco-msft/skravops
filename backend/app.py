from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend requests

@app.route("/send-email", methods=["POST"])
def send_email():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"error": "Missing fields"}), 400

    subject = f"New message from {name}"
    body = f"From: {name} <{email}>\n\n{message}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = os.environ["EMAIL_FROM"]
    msg["To"] = os.environ["EMAIL_TO"]

    try:
        with smtplib.SMTP(os.environ["EMAIL_HOST"], int(os.environ["EMAIL_PORT"])) as server:
            server.starttls()
            server.login(os.environ["EMAIL_USER"], os.environ["EMAIL_PASSWORD"])
            server.sendmail(msg["From"], msg["To"], msg.as_string())
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

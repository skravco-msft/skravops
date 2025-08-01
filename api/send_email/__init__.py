import azure.functions as func
import smtplib
import json
import os

from email.mime.text import MIMEText

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return func.HttpResponse(
                json.dumps({"error": "Missing fields"}),
                status_code=400,
                mimetype="application/json"
            )

        subject = f"New message from {name}"
        body = f"From: {name} <{email}>\n\n{message}"

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = os.environ["EMAIL_FROM"]
        msg["To"] = os.environ["EMAIL_TO"]

        with smtplib.SMTP(os.environ["EMAIL_HOST"], int(os.environ["EMAIL_PORT"])) as server:
            server.starttls()
            server.login(os.environ["EMAIL_USER"], os.environ["EMAIL_PASSWORD"])
            server.sendmail(msg["From"], msg["To"], msg.as_string())

        return func.HttpResponse(
            json.dumps({"message": "Email sent successfully"}),
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )


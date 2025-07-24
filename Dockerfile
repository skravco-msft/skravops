# Use slim base image
FROM python:3.11-slim

# Create non-root user
RUN adduser --disabled-password --no-create-home appuser

# Set working directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY backend/ .

# Change to non-root user
USER appuser

# Expose port (internal use only)
EXPOSE 5000

# Start app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]


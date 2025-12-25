# Dockerfile for backend deployment
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY api.py .
COPY model.py .
COPY *.pkl ./
COPY *.csv ./

# If model files don't exist, train the model
RUN if [ ! -f best_stacking_model.pkl ]; then python model.py; fi

# Expose port
EXPOSE 8000

# Set environment variable
ENV PORT=8000

# Run the application
CMD ["python", "api.py"]

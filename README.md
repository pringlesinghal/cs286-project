# Image Processing Web App

A web application for uploading, cropping, and processing images.

## Project Structure

```
project_root/
├── frontend/
│   ├── src/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── main.py
│   ├── requirements.yaml
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick Start (Docker)

1. Clone the repository:
   ```
   git clone https://github.com/pringlesinghal/cs286-project.git
   cd cs286-project
   ```

2. Build and run:
   ```
   docker compose up --build
   ```

3. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Manual Setup

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
conda env create -f requirements.yaml
conda activate fastapi-backend
uvicorn main:app --reload
```

## Usage

1. Open http://localhost:3000
2. Upload an image
3. Crop the image
4. Submit for processing
5. View original and processed images

## API

- `POST /process_image`: Upload and process an image

## Tech Stack

- Frontend: React.js
- Backend: FastAPI (Python)
- Image Processing: Pillow
- Containerization: Docker

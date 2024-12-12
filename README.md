# Automatic Medical Segmentation from VLM-Guided Detection

## Supplementary Material
We include supplementary material as a [zip file](Supplementary.zip) which contains the VQA prompts, ontology serialization and evaluation logs on test data.

## Project Description
Biomedical image segmentation remains a laborious task despite advancements in image segmentation models because the process of image analysis and generating segmentation masks continue to be two separate processes that need to be manually connected with expert input. We propose to build an agentic system that merges these workflows to create an end-to-end image analysis and segmentation model. Our system only takes a medical image as input and utilizes Gemini Flash along with a predefined medical ontology to create image descriptions at multiple granularity levels and synthesizes corresponding masks with BiomedParse. We critically evaluate the performance of different components of our system as well as the whole pipeline and show strong performance on diverse imaging modalities and anatomical regions. We believe that our system has the potential to speed up clinical workflows and improve medical education by providing more insights into medical images faster. We also build a full-stack application demo of our system. Our application code is available at [https://github.com/pringlesinghal/cs286-project](https://github.com/pringlesinghal/cs286-project) and a demo is hosted at [https://mhamzaerol-vlm-guided-auto-medical-segmentation.hf.space/](https://mhamzaerol-vlm-guided-auto-medical-segmentation.hf.space/)



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
   docker compose up -d --build
   ```

3. Access the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000]([http://localhost:8000)

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
3. Crop the image (only accepts square crops)
4. Submit for processing (to be implemented)
5. View original and processed images

## API

- `POST /process_image`: Upload and process an image

## Tech Stack

- Frontend: React.js
- Backend: FastAPI (Python)
- Image Processing: Pillow
- Containerization: Docker

# 🎬 CineMind — Movie Recommender System

A full-stack Movie Recommendation System built as a college project. It combines a **FastAPI** Python backend with a **React (Vite)** frontend called **CineMind**, using TF-IDF and genre-based machine learning to recommend movies.

---

## 📸 Overview

CineMind lets users:
- Browse trending, popular, top-rated, now playing, and upcoming movies
- Search for any movie by title with live suggestions
- View detailed movie info (poster, overview, genres, backdrop)
- Get **TF-IDF** based similar movie recommendations
- Get **genre-based** recommendations
- Register, log in, and access a personal dashboard

---

## 🏗️ Architecture

```
movie-recommender-system/
├── main.py              # FastAPI backend (REST API)
├── app.py               # Streamlit UI (alternative frontend)
├── movies.ipynb         # Jupyter notebook — data preprocessing & model training
├── requirements.txt     # Python dependencies
├── runtime.txt          # Python version for deployment
├── .env                 # Environment variables (not committed)
│
└── cinemind/            # React + Vite frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── MovieDetail.jsx
    │   ├── components/
    │   │   ├── GenreSection.jsx
    │   │   └── ProsCons.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

> **Note:** Large files (`*.pkl`, `*.csv`) are excluded from the repo via `.gitignore`. See the [Setup](#-setup--installation) section for how to generate them.

---

## 🤖 How the Recommendation Works

| Method | Description |
|---|---|
| **TF-IDF** | Vectorizes movie metadata (title, overview, genres, cast). Computes cosine similarity to find textually similar movies. |
| **Genre-based** | Filters movies sharing the same genres as the selected movie. |

The models are pre-trained offline using `movies.ipynb` and serialized as `.pkl` files loaded by the FastAPI backend at runtime.

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| Python 3.x | Core language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| scikit-learn | TF-IDF vectorization + cosine similarity |
| pandas / numpy | Data processing |
| httpx | Async HTTP (TMDB API calls) |
| python-dotenv | Environment variable management |
| Streamlit | Alternative UI |

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool / dev server |
| Vanilla CSS | Styling |

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [TMDB API Key](https://www.themoviedb.org/settings/api)

---

### 1. Clone the repository

```bash
git clone https://github.com/itskd2k69/movie-recommender-system.git
cd movie-recommender-system
```

---

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root directory:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

---

### 3. Generate ML Model Files

The `.pkl` model files are not included in the repo (they are large binary files). Generate them by running the Jupyter notebook:

```bash
jupyter notebook movies.ipynb
```

Run all cells. This will produce:
- `df.pkl` — processed movie dataframe
- `tfidf.pkl` — TF-IDF vectorizer
- `tfidf_matrix.pkl` — TF-IDF feature matrix
- `indices.pkl` — movie title-to-index mapping

---

### 4. Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

API will be available at: `http://127.0.0.1:8000`  
Interactive docs: `http://127.0.0.1:8000/docs`

---

### 5. Frontend Setup (CineMind React App)

```bash
cd cinemind
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

### Alternative: Streamlit UI

```bash
# From the project root (with .venv active)
streamlit run app.py
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `TMDB_API_KEY` | Your API key from [themoviedb.org](https://www.themoviedb.org/settings/api) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/home` | Fetch trending/popular/top-rated movies |
| `GET` | `/tmdb/search?query=` | Search movies by title |
| `GET` | `/movie/id/{tmdb_id}` | Get detailed info for a movie |
| `GET` | `/movie/search?query=` | Get TF-IDF + genre recommendations |
| `GET` | `/recommend/genre?tmdb_id=` | Genre-based recommendations only |

---

## 📦 Python Dependencies

```
fastapi==0.111.0
uvicorn==0.30.1
python-dotenv==1.0.1
httpx==0.27.0
pandas==2.2.3
numpy==2.0.1
scipy==1.13.1
scikit-learn==1.6.1
streamlit==1.36.0
```

---

## 📁 What's NOT in the Repo

These files are excluded via `.gitignore` and must be generated or obtained separately:

| File | Reason |
|---|---|
| `*.pkl` | Large ML model files (50MB+) — generate via `movies.ipynb` |
| `movies_metadata.csv` | Large dataset (34MB+) — download from TMDB / Kaggle |
| `.venv/`, `venv/` | Virtual environment — run `pip install -r requirements.txt` |
| `cinemind/node_modules/` | Node packages — run `npm install` |
| `.env` | Secrets — create your own with your TMDB API key |
| `users.json` | Local user data |

---

## 👨‍💻 Author

**itskd2k69**  
College Project — Movie Recommender System

---

## 📄 License

This project is for educational purposes only.

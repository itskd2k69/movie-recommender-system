# import os
# import json
# import pickle
# import hashlib
# from typing import Optional, List, Dict, Any, Tuple

# import numpy as np
# import pandas as pd
# import httpx
# from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv


# # =========================
# # ENV
# # =========================
# load_dotenv()
# TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# TMDB_BASE    = "https://api.themoviedb.org/3"
# TMDB_IMG_500 = "https://image.tmdb.org/t/p/w500"

# if not TMDB_API_KEY:
#     raise RuntimeError("TMDB_API_KEY missing. Put it in .env as TMDB_API_KEY=xxxx")


# # =========================
# # FASTAPI APP
# # =========================
# app = FastAPI(title="Movie Recommender API", version="4.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # =========================
# # PATHS
# # =========================
# BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
# DF_PATH         = os.path.join(BASE_DIR, "df.pkl")
# INDICES_PATH    = os.path.join(BASE_DIR, "indices.pkl")
# TFIDF_MATRIX_PATH = os.path.join(BASE_DIR, "tfidf_matrix.pkl")
# TFIDF_PATH      = os.path.join(BASE_DIR, "tfidf.pkl")
# USERS_PATH      = os.path.join(BASE_DIR, "users.json")


# # =========================
# # PICKLE GLOBALS
# # =========================
# df: Optional[pd.DataFrame] = None
# indices_obj: Any            = None
# tfidf_matrix: Any           = None
# tfidf_obj: Any              = None
# TITLE_TO_IDX: Optional[Dict[str, int]] = None


# # =========================
# # PYDANTIC MODELS
# # =========================
# class TMDBMovieCard(BaseModel):
#     tmdb_id: int
#     title: str
#     poster_url: Optional[str]    = None
#     release_date: Optional[str]  = None
#     vote_average: Optional[float]= None


# class TMDBMovieDetails(BaseModel):
#     tmdb_id: int
#     title: str
#     overview: Optional[str]      = None
#     release_date: Optional[str]  = None
#     poster_url: Optional[str]    = None
#     backdrop_url: Optional[str]  = None
#     genres: List[dict]           = []
#     vote_average: Optional[float]= None
#     vote_count: Optional[int]    = None
#     popularity: Optional[float]  = None
#     runtime: Optional[int]       = None


# class TFIDFRecItem(BaseModel):
#     title: str
#     score: float
#     tmdb: Optional[TMDBMovieCard] = None


# class SearchBundleResponse(BaseModel):
#     query: str
#     movie_details: TMDBMovieDetails
#     tfidf_recommendations: List[TFIDFRecItem]
#     genre_recommendations: List[TMDBMovieCard]


# # ── Auth models ──
# class RegisterRequest(BaseModel):
#     name: str
#     email: str
#     password: str
#     favorite_genres: Optional[List[str]] = []


# class LoginRequest(BaseModel):
#     email: str
#     password: str


# class AuthResponse(BaseModel):
#     success: bool
#     message: str
#     user: Optional[dict] = None


# # =========================
# # AUTH HELPERS
# # =========================
# def _hash_password(password: str) -> str:
#     return hashlib.sha256(password.encode()).hexdigest()


# def _load_users() -> List[dict]:
#     if not os.path.exists(USERS_PATH):
#         return []
#     with open(USERS_PATH, "r") as f:
#         try:
#             return json.load(f)
#         except Exception:
#             return []


# def _save_users(users: List[dict]):
#     with open(USERS_PATH, "w") as f:
#         json.dump(users, f, indent=2)


# # =========================
# # UTILS
# # =========================
# def _norm_title(t: str) -> str:
#     return str(t).strip().lower()


# def make_img_url(path: Optional[str]) -> Optional[str]:
#     if not path:
#         return None
#     return f"{TMDB_IMG_500}{path}"


# async def tmdb_get(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
#     q = dict(params)
#     q["api_key"] = TMDB_API_KEY
#     try:
#         async with httpx.AsyncClient(timeout=20) as client:
#             r = await client.get(f"{TMDB_BASE}{path}", params=q)
#     except httpx.RequestError as e:
#         raise HTTPException(status_code=502, detail=f"TMDB request error: {type(e).__name__} | {repr(e)}")
#     if r.status_code != 200:
#         raise HTTPException(status_code=502, detail=f"TMDB error {r.status_code}: {r.text}")
#     return r.json()


# async def tmdb_cards_from_results(results: List[dict], limit: int = 20) -> List[TMDBMovieCard]:
#     out: List[TMDBMovieCard] = []
#     for m in (results or [])[:limit]:
#         out.append(TMDBMovieCard(
#             tmdb_id=int(m["id"]),
#             title=m.get("title") or m.get("name") or "",
#             poster_url=make_img_url(m.get("poster_path")),
#             release_date=m.get("release_date"),
#             vote_average=m.get("vote_average"),
#         ))
#     return out


# async def tmdb_movie_details(movie_id: int) -> TMDBMovieDetails:
#     data = await tmdb_get(f"/movie/{movie_id}", {"language": "en-US"})
#     return TMDBMovieDetails(
#         tmdb_id=int(data["id"]),
#         title=data.get("title") or "",
#         overview=data.get("overview"),
#         release_date=data.get("release_date"),
#         poster_url=make_img_url(data.get("poster_path")),
#         backdrop_url=make_img_url(data.get("backdrop_path")),
#         genres=data.get("genres", []) or [],
#         vote_average=data.get("vote_average"),
#         vote_count=data.get("vote_count"),
#         popularity=data.get("popularity"),
#         runtime=data.get("runtime"),
#     )


# async def tmdb_search_movies(query: str, page: int = 1) -> Dict[str, Any]:
#     return await tmdb_get("/search/movie", {
#         "query": query,
#         "include_adult": "false",
#         "language": "en-US",
#         "page": page,
#     })


# async def tmdb_search_first(query: str) -> Optional[dict]:
#     data = await tmdb_search_movies(query=query, page=1)
#     results = data.get("results", [])
#     return results[0] if results else None


# # =========================
# # TF-IDF HELPERS
# # =========================
# def build_title_to_idx_map(indices: Any) -> Dict[str, int]:
#     title_to_idx: Dict[str, int] = {}
#     if isinstance(indices, dict):
#         for k, v in indices.items():
#             title_to_idx[_norm_title(k)] = int(v)
#         return title_to_idx
#     try:
#         for k, v in indices.items():
#             title_to_idx[_norm_title(k)] = int(v)
#         return title_to_idx
#     except Exception:
#         raise RuntimeError("indices.pkl must be dict or pandas Series-like")


# def get_local_idx_by_title(title: str) -> int:
#     global TITLE_TO_IDX
#     if TITLE_TO_IDX is None:
#         raise HTTPException(status_code=500, detail="TF-IDF index map not initialized")

#     key = _norm_title(title)

#     # 1) Exact match
#     if key in TITLE_TO_IDX:
#         return int(TITLE_TO_IDX[key])

#     # 2) Strip after colon
#     short_key = key.split(':')[0].strip()
#     for stored, idx in TITLE_TO_IDX.items():
#         if stored.split(':')[0].strip() == short_key:
#             return int(idx)

#     # 3) Partial contains
#     for stored, idx in TITLE_TO_IDX.items():
#         if key in stored or stored in key:
#             return int(idx)

#     # 4) Word overlap
#     stop = {'the', 'a', 'an', 'of', 'and', 'in'}
#     key_words = set(key.split()) - stop
#     best_idx, best_score = None, 0
#     for stored, idx in TITLE_TO_IDX.items():
#         stored_words = set(stored.split()) - stop
#         overlap = len(key_words & stored_words)
#         if overlap > best_score:
#             best_score = overlap
#             best_idx = idx

#     if best_idx is not None and best_score >= 1:
#         return int(best_idx)

#     raise HTTPException(status_code=404, detail=f"Title not found in local dataset: '{title}'")


# def tfidf_recommend_titles(query_title: str, top_n: int = 10) -> List[Tuple[str, float]]:
#     global df, tfidf_matrix
#     if df is None or tfidf_matrix is None:
#         raise HTTPException(status_code=500, detail="TF-IDF resources not loaded")

#     idx    = get_local_idx_by_title(query_title)
#     qv     = tfidf_matrix[idx]
#     scores = (tfidf_matrix @ qv.T).toarray().ravel()
#     order  = np.argsort(-scores)

#     out: List[Tuple[str, float]] = []
#     for i in order:
#         if int(i) == int(idx):
#             continue
#         try:
#             title_i = str(df.iloc[int(i)]["title"])
#         except Exception:
#             continue
#         out.append((title_i, float(scores[int(i)])))
#         if len(out) >= top_n:
#             break
#     return out


# async def attach_tmdb_card_by_title(title: str) -> Optional[TMDBMovieCard]:
#     try:
#         m = await tmdb_search_first(title)
#         if not m:
#             return None
#         return TMDBMovieCard(
#             tmdb_id=int(m["id"]),
#             title=m.get("title") or title,
#             poster_url=make_img_url(m.get("poster_path")),
#             release_date=m.get("release_date"),
#             vote_average=m.get("vote_average"),
#         )
#     except Exception:
#         return None


# # =========================
# # STARTUP
# # =========================
# @app.on_event("startup")
# def load_pickles():
#     global df, indices_obj, tfidf_matrix, tfidf_obj, TITLE_TO_IDX

#     with open(DF_PATH, "rb") as f:
#         df = pickle.load(f)
#     with open(INDICES_PATH, "rb") as f:
#         indices_obj = pickle.load(f)
#     with open(TFIDF_MATRIX_PATH, "rb") as f:
#         tfidf_matrix = pickle.load(f)
#     with open(TFIDF_PATH, "rb") as f:
#         tfidf_obj = pickle.load(f)

#     TITLE_TO_IDX = build_title_to_idx_map(indices_obj)

#     if df is None or "title" not in df.columns:
#         raise RuntimeError("df.pkl must contain a DataFrame with a 'title' column")

#     # Create users.json if it doesn't exist
#     if not os.path.exists(USERS_PATH):
#         with open(USERS_PATH, "w") as f:
#             json.dump([], f)


# # =========================
# # ROUTES
# # =========================
# @app.get("/health")
# def health():
#     return {"status": "ok"}


# # ── AUTH ──────────────────────────────────────────────
# @app.post("/auth/register", response_model=AuthResponse)
# def register(req: RegisterRequest):
#     users = _load_users()

#     # Check duplicate email
#     if any(u["email"].lower() == req.email.lower() for u in users):
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = {
#         "name":            req.name.strip(),
#         "email":           req.email.lower().strip(),
#         "password":        _hash_password(req.password),
#         "favorite_genres": req.favorite_genres or [],
#     }
#     users.append(new_user)
#     _save_users(users)

#     safe_user = {k: v for k, v in new_user.items() if k != "password"}
#     return AuthResponse(success=True, message="Account created successfully!", user=safe_user)


# @app.post("/auth/login", response_model=AuthResponse)
# def login(req: LoginRequest):
#     users = _load_users()
#     hashed = _hash_password(req.password)

#     for u in users:
#         if u["email"].lower() == req.email.lower() and u["password"] == hashed:
#             safe_user = {k: v for k, v in u.items() if k != "password"}
#             return AuthResponse(success=True, message=f"Welcome back, {u['name']}!", user=safe_user)

#     raise HTTPException(status_code=401, detail="Invalid email or password")


# # ── HOME FEED ─────────────────────────────────────────
# @app.get("/home", response_model=List[TMDBMovieCard])
# async def home(
#     category: str = Query("popular"),
#     limit: int    = Query(24, ge=1, le=50),
# ):
#     try:
#         if category == "trending":
#             data = await tmdb_get("/trending/movie/day", {"language": "en-US"})
#             return await tmdb_cards_from_results(data.get("results", []), limit=limit)

#         if category not in {"popular", "top_rated", "upcoming", "now_playing"}:
#             raise HTTPException(status_code=400, detail="Invalid category")

#         data = await tmdb_get(f"/movie/{category}", {"language": "en-US", "page": 1})
#         return await tmdb_cards_from_results(data.get("results", []), limit=limit)

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Home route failed: {e}")


# # ── GENRE MOVIES ──────────────────────────────────────
# @app.get("/movies/genre/{genre_id}", response_model=List[TMDBMovieCard])
# async def movies_by_genre(
#     genre_id: int,
#     limit: int = Query(24, ge=1, le=50),
#     page: int  = Query(1, ge=1, le=5),
# ):
#     data = await tmdb_get("/discover/movie", {
#         "with_genres":  genre_id,
#         "language":     "en-US",
#         "sort_by":      "popularity.desc",
#         "page":         page,
#     })
#     return await tmdb_cards_from_results(data.get("results", []), limit=limit)


# # ── TMDB SEARCH ───────────────────────────────────────
# @app.get("/tmdb/search")
# async def tmdb_search(
#     query: str = Query(..., min_length=1),
#     page: int  = Query(1, ge=1, le=10),
# ):
#     return await tmdb_search_movies(query=query, page=page)


# # ── MOVIE DETAILS ─────────────────────────────────────
# @app.get("/movie/id/{tmdb_id}", response_model=TMDBMovieDetails)
# async def movie_details_route(tmdb_id: int):
#     return await tmdb_movie_details(tmdb_id)


# # ── GENRE RECOMMENDATIONS ─────────────────────────────
# @app.get("/recommend/genre", response_model=List[TMDBMovieCard])
# async def recommend_genre(
#     tmdb_id: int = Query(...),
#     limit: int   = Query(18, ge=1, le=50),
# ):
#     details = await tmdb_movie_details(tmdb_id)
#     if not details.genres:
#         return []

#     genre_id = details.genres[0]["id"]
#     discover = await tmdb_get("/discover/movie", {
#         "with_genres": genre_id,
#         "language":    "en-US",
#         "sort_by":     "popularity.desc",
#         "page":        1,
#     })
#     cards = await tmdb_cards_from_results(discover.get("results", []), limit=limit)
#     return [c for c in cards if c.tmdb_id != tmdb_id]


# # ── TF-IDF ONLY ───────────────────────────────────────
# @app.get("/recommend/tfidf")
# async def recommend_tfidf(
#     title: str = Query(..., min_length=1),
#     top_n: int = Query(10, ge=1, le=50),
# ):
#     recs = tfidf_recommend_titles(title, top_n=top_n)
#     return [{"title": t, "score": s} for t, s in recs]


# # ── BUNDLE ────────────────────────────────────────────
# @app.get("/movie/search", response_model=SearchBundleResponse)
# async def search_bundle(
#     query: str      = Query(..., min_length=1),
#     tfidf_top_n: int = Query(12, ge=1, le=30),
#     genre_limit: int = Query(12, ge=1, le=30),
# ):
#     best = await tmdb_search_first(query)
#     if not best:
#         raise HTTPException(status_code=404, detail=f"No TMDB movie found for query: {query}")

#     tmdb_id = int(best["id"])
#     details = await tmdb_movie_details(tmdb_id)

#     tfidf_items: List[TFIDFRecItem] = []
#     recs: List[Tuple[str, float]]   = []
#     try:
#         recs = tfidf_recommend_titles(details.title, top_n=tfidf_top_n)
#     except Exception:
#         try:
#             recs = tfidf_recommend_titles(query, top_n=tfidf_top_n)
#         except Exception:
#             recs = []

#     for title, score in recs:
#         card = await attach_tmdb_card_by_title(title)
#         tfidf_items.append(TFIDFRecItem(title=title, score=score, tmdb=card))

#     genre_recs: List[TMDBMovieCard] = []
#     if details.genres:
#         genre_id = details.genres[0]["id"]
#         discover = await tmdb_get("/discover/movie", {
#             "with_genres": genre_id,
#             "language":    "en-US",
#             "sort_by":     "popularity.desc",
#             "page":        1,
#         })
#         cards = await tmdb_cards_from_results(discover.get("results", []), limit=genre_limit)
#         genre_recs = [c for c in cards if c.tmdb_id != details.tmdb_id]

#     return SearchBundleResponse(
#         query=query,
#         movie_details=details,
#         tfidf_recommendations=tfidf_items,
#         genre_recommendations=genre_recs,
#     )


import os
import json
import pickle
import hashlib
from typing import Optional, List, Dict, Any, Tuple

import numpy as np
import pandas as pd
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv


# =========================
# ENV
# =========================
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

TMDB_BASE    = "https://api.themoviedb.org/3"
TMDB_IMG_500 = "https://image.tmdb.org/t/p/w500"

if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY missing. Put it in .env as TMDB_API_KEY=xxxx")


# =========================
# FASTAPI APP
# =========================
app = FastAPI(title="Movie Recommender API", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# PATHS
# =========================
BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
DF_PATH         = os.path.join(BASE_DIR, "df.pkl")
INDICES_PATH    = os.path.join(BASE_DIR, "indices.pkl")
TFIDF_MATRIX_PATH = os.path.join(BASE_DIR, "tfidf_matrix.pkl")
TFIDF_PATH      = os.path.join(BASE_DIR, "tfidf.pkl")
USERS_PATH      = os.path.join(BASE_DIR, "users.json")


# =========================
# PICKLE GLOBALS
# =========================
df: Optional[pd.DataFrame] = None
indices_obj: Any            = None
tfidf_matrix: Any           = None
tfidf_obj: Any              = None
TITLE_TO_IDX: Optional[Dict[str, int]] = None


# =========================
# PYDANTIC MODELS
# =========================
class TMDBMovieCard(BaseModel):
    tmdb_id: int
    title: str
    poster_url: Optional[str]    = None
    release_date: Optional[str]  = None
    vote_average: Optional[float]= None


class TMDBMovieDetails(BaseModel):
    tmdb_id: int
    title: str
    overview: Optional[str]      = None
    release_date: Optional[str]  = None
    poster_url: Optional[str]    = None
    backdrop_url: Optional[str]  = None
    genres: List[dict]           = []
    vote_average: Optional[float]= None
    vote_count: Optional[int]    = None
    popularity: Optional[float]  = None
    runtime: Optional[int]       = None


class TFIDFRecItem(BaseModel):
    title: str
    score: float
    tmdb: Optional[TMDBMovieCard] = None


class SearchBundleResponse(BaseModel):
    query: str
    movie_details: TMDBMovieDetails
    tfidf_recommendations: List[TFIDFRecItem]
    genre_recommendations: List[TMDBMovieCard]


# ── Auth models ──
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    favorite_genres: Optional[List[str]] = []


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None


# =========================
# AUTH HELPERS
# =========================
def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def _load_users() -> List[dict]:
    if not os.path.exists(USERS_PATH):
        return []
    with open(USERS_PATH, "r") as f:
        try:
            return json.load(f)
        except Exception:
            return []


def _save_users(users: List[dict]):
    with open(USERS_PATH, "w") as f:
        json.dump(users, f, indent=2)


# =========================
# UTILS
# =========================
def _norm_title(t: str) -> str:
    return str(t).strip().lower()


def make_img_url(path: Optional[str]) -> Optional[str]:
    if not path:
        return None
    return f"{TMDB_IMG_500}{path}"


async def tmdb_get(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    q = dict(params)
    q["api_key"] = TMDB_API_KEY
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(f"{TMDB_BASE}{path}", params=q)
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"TMDB request error: {type(e).__name__} | {repr(e)}")
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"TMDB error {r.status_code}: {r.text}")
    return r.json()


async def tmdb_cards_from_results(results: List[dict], limit: int = 20) -> List[TMDBMovieCard]:
    out: List[TMDBMovieCard] = []
    for m in (results or [])[:limit]:
        out.append(TMDBMovieCard(
            tmdb_id=int(m["id"]),
            title=m.get("title") or m.get("name") or "",
            poster_url=make_img_url(m.get("poster_path")),
            release_date=m.get("release_date"),
            vote_average=m.get("vote_average"),
        ))
    return out


async def tmdb_movie_details(movie_id: int) -> TMDBMovieDetails:
    data = await tmdb_get(f"/movie/{movie_id}", {"language": "en-US"})
    return TMDBMovieDetails(
        tmdb_id=int(data["id"]),
        title=data.get("title") or "",
        overview=data.get("overview"),
        release_date=data.get("release_date"),
        poster_url=make_img_url(data.get("poster_path")),
        backdrop_url=make_img_url(data.get("backdrop_path")),
        genres=data.get("genres", []) or [],
        vote_average=data.get("vote_average"),
        vote_count=data.get("vote_count"),
        popularity=data.get("popularity"),
        runtime=data.get("runtime"),
    )


async def tmdb_search_movies(query: str, page: int = 1) -> Dict[str, Any]:
    return await tmdb_get("/search/movie", {
        "query": query,
        "include_adult": "false",
        "language": "en-US",
        "page": page,
    })


async def tmdb_search_first(query: str) -> Optional[dict]:
    data = await tmdb_search_movies(query=query, page=1)
    results = data.get("results", [])
    return results[0] if results else None


# =========================
# TF-IDF HELPERS (UPDATED WITH DEBUG)
# =========================
def build_title_to_idx_map(indices: Any) -> Dict[str, int]:
    title_to_idx: Dict[str, int] = {}
    if isinstance(indices, dict):
        for k, v in indices.items():
            title_to_idx[_norm_title(k)] = int(v)
        return title_to_idx
    try:
        for k, v in indices.items():
            title_to_idx[_norm_title(k)] = int(v)
        return title_to_idx
    except Exception:
        raise RuntimeError("indices.pkl must be dict or pandas Series-like")


def get_local_idx_by_title(title: str) -> int:
    global TITLE_TO_IDX
    if TITLE_TO_IDX is None:
        raise HTTPException(status_code=500, detail="TF-IDF index map not initialized")

    key = _norm_title(title)

    if key in TITLE_TO_IDX:
        return int(TITLE_TO_IDX[key])

    # Fallback matches
    short_key = key.split(':')[0].strip()
    for stored, idx in TITLE_TO_IDX.items():
        if stored.split(':')[0].strip() == short_key:
            return int(idx)

    for stored, idx in TITLE_TO_IDX.items():
        if key in stored or stored in key:
            return int(idx)

    # Word overlap
    stop = {'the', 'a', 'an', 'of', 'and', 'in'}
    key_words = set(key.split()) - stop
    best_idx, best_score = None, 0
    for stored, idx in TITLE_TO_IDX.items():
        stored_words = set(stored.split()) - stop
        overlap = len(key_words & stored_words)
        if overlap > best_score:
            best_score = overlap
            best_idx = idx

    if best_idx is not None and best_score >= 1:
        return int(best_idx)

    raise HTTPException(status_code=404, detail=f"Title not found: '{title}'")


def tfidf_recommend_titles(query_title: str, top_n: int = 10) -> List[Tuple[str, float]]:
    global df, tfidf_matrix
    print(f"🔍 [TFIDF] Request for: '{query_title}'")

    if df is None or tfidf_matrix is None:
        print("❌ TF-IDF resources not loaded")
        raise HTTPException(status_code=500, detail="TF-IDF resources not loaded")

    try:
        idx = get_local_idx_by_title(query_title)
        print(f"✅ Found index {idx} for '{query_title}'")

        qv = tfidf_matrix[idx]
        scores = (tfidf_matrix @ qv.T).toarray().ravel()
        print(f"✅ Score calculation successful")

        order = np.argsort(-scores)

        out: List[Tuple[str, float]] = []
        for i in order:
            if int(i) == int(idx):
                continue
            try:
                title_i = str(df.iloc[int(i)]["title"])
                score = float(scores[int(i)])
                out.append((title_i, score))
                if len(out) >= top_n:
                    break
            except:
                continue

        print(f"✅ Successfully generated {len(out)} recommendations")
        return out

    except Exception as e:
        print(f"❌ ERROR in tfidf_recommend_titles: {type(e).__name__} - {e}")
        raise


async def attach_tmdb_card_by_title(title: str) -> Optional[TMDBMovieCard]:
    try:
        m = await tmdb_search_first(title)
        if not m:
            return None
        return TMDBMovieCard(
            tmdb_id=int(m["id"]),
            title=m.get("title") or title,
            poster_url=make_img_url(m.get("poster_path")),
            release_date=m.get("release_date"),
            vote_average=m.get("vote_average"),
        )
    except Exception:
        return None


# =========================
# STARTUP (UPDATED WITH DEBUG)
# =========================
@app.on_event("startup")
def load_pickles():
    global df, indices_obj, tfidf_matrix, tfidf_obj, TITLE_TO_IDX

    print("\n🔄 [STARTUP] Loading pickle files...")

    try:
        with open(DF_PATH, "rb") as f:
            df = pickle.load(f)
        print(f"✅ df.pkl loaded → Shape: {df.shape}")

        with open(INDICES_PATH, "rb") as f:
            indices_obj = pickle.load(f)
        print(f"✅ indices.pkl loaded → Type: {type(indices_obj)}")

        with open(TFIDF_MATRIX_PATH, "rb") as f:
            tfidf_matrix = pickle.load(f)
        print(f"✅ tfidf_matrix.pkl loaded → Shape: {tfidf_matrix.shape}")

        with open(TFIDF_PATH, "rb") as f:
            tfidf_obj = pickle.load(f)
        print(f"✅ tfidf.pkl loaded → Type: {type(tfidf_obj)}")

        TITLE_TO_IDX = build_title_to_idx_map(indices_obj)
        print(f"✅ TITLE_TO_IDX built → {len(TITLE_TO_IDX)} movies")

        print("🎉 ALL MODELS LOADED SUCCESSFULLY!\n")

    except Exception as e:
        print(f"❌ FAILED TO LOAD PICKLES: {e}")
        raise


# =========================
# ROUTES (Rest same)
# =========================
@app.get("/health")
def health():
    return {"status": "ok"}


# Auth routes (same as before)
@app.post("/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    users = _load_users()
    if any(u["email"].lower() == req.email.lower() for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "name": req.name.strip(),
        "email": req.email.lower().strip(),
        "password": _hash_password(req.password),
        "favorite_genres": req.favorite_genres or [],
    }
    users.append(new_user)
    _save_users(users)

    safe_user = {k: v for k, v in new_user.items() if k != "password"}
    return AuthResponse(success=True, message="Account created successfully!", user=safe_user)


@app.post("/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    users = _load_users()
    hashed = _hash_password(req.password)

    for u in users:
        if u["email"].lower() == req.email.lower() and u["password"] == hashed:
            safe_user = {k: v for k, v in u.items() if k != "password"}
            return AuthResponse(success=True, message=f"Welcome back, {u['name']}!", user=safe_user)

    raise HTTPException(status_code=401, detail="Invalid email or password")


# Other routes remain same (home, genre, movie details, etc.)
@app.get("/home", response_model=List[TMDBMovieCard])
async def home(category: str = Query("popular"), limit: int = Query(24, ge=1, le=50)):
    try:
        if category == "trending":
            data = await tmdb_get("/trending/movie/day", {"language": "en-US"})
            return await tmdb_cards_from_results(data.get("results", []), limit=limit)

        if category not in {"popular", "top_rated", "upcoming", "now_playing"}:
            raise HTTPException(status_code=400, detail="Invalid category")

        data = await tmdb_get(f"/movie/{category}", {"language": "en-US", "page": 1})
        return await tmdb_cards_from_results(data.get("results", []), limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Home route failed: {e}")


@app.get("/movies/genre/{genre_id}", response_model=List[TMDBMovieCard])
async def movies_by_genre(genre_id: int, limit: int = Query(24, ge=1, le=50), page: int = Query(1, ge=1, le=5)):
    data = await tmdb_get("/discover/movie", {
        "with_genres": genre_id,
        "language": "en-US",
        "sort_by": "popularity.desc",
        "page": page,
    })
    return await tmdb_cards_from_results(data.get("results", []), limit=limit)


@app.get("/movie/id/{tmdb_id}", response_model=TMDBMovieDetails)
async def movie_details_route(tmdb_id: int):
    return await tmdb_movie_details(tmdb_id)


@app.get("/recommend/genre", response_model=List[TMDBMovieCard])
async def recommend_genre(tmdb_id: int = Query(...), limit: int = Query(18, ge=1, le=50)):
    details = await tmdb_movie_details(tmdb_id)
    if not details.genres:
        return []
    genre_id = details.genres[0]["id"]
    discover = await tmdb_get("/discover/movie", {
        "with_genres": genre_id,
        "language": "en-US",
        "sort_by": "popularity.desc",
        "page": 1,
    })
    cards = await tmdb_cards_from_results(discover.get("results", []), limit=limit)
    return [c for c in cards if c.tmdb_id != tmdb_id]


@app.get("/recommend/tfidf")
async def recommend_tfidf(title: str = Query(..., min_length=1), top_n: int = Query(10, ge=1, le=50)):
    recs = tfidf_recommend_titles(title, top_n=top_n)
    return [{"title": t, "score": s} for t, s in recs]


@app.get("/movie/search", response_model=SearchBundleResponse)
async def search_bundle(query: str = Query(..., min_length=1), tfidf_top_n: int = Query(12, ge=1, le=30), genre_limit: int = Query(12, ge=1, le=30)):
    best = await tmdb_search_first(query)
    if not best:
        raise HTTPException(status_code=404, detail=f"No TMDB movie found for query: {query}")

    tmdb_id = int(best["id"])
    details = await tmdb_movie_details(tmdb_id)

    tfidf_items: List[TFIDFRecItem] = []
    recs: List[Tuple[str, float]] = []
    try:
        recs = tfidf_recommend_titles(details.title, top_n=tfidf_top_n)
    except Exception as e:
        print(f"⚠️ TF-IDF failed for {details.title}, trying fallback: {e}")
        try:
            recs = tfidf_recommend_titles(query, top_n=tfidf_top_n)
        except Exception:
            recs = []

    for title, score in recs:
        card = await attach_tmdb_card_by_title(title)
        tfidf_items.append(TFIDFRecItem(title=title, score=score, tmdb=card))

    # Genre recommendations
    genre_recs: List[TMDBMovieCard] = []
    if details.genres:
        genre_id = details.genres[0]["id"]
        discover = await tmdb_get("/discover/movie", {
            "with_genres": genre_id,
            "language": "en-US",
            "sort_by": "popularity.desc",
            "page": 1,
        })
        cards = await tmdb_cards_from_results(discover.get("results", []), limit=genre_limit)
        genre_recs = [c for c in cards if c.tmdb_id != details.tmdb_id]

    return SearchBundleResponse(
        query=query,
        movie_details=details,
        tfidf_recommendations=tfidf_items,
        genre_recommendations=genre_recs,
    )
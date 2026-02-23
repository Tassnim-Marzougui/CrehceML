import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.main import app

client = TestClient(app)

# ══════════════════════════════════════════════════
#  FIXTURES
# ══════════════════════════════════════════════════
@pytest.fixture
def admin_token():
    res = client.post("/api/auth/login", json={
        "email": "admin@nursery.com",
        "password": "Admin1234!"
    })
    return res.json().get("access_token")

@pytest.fixture
def moderateur_token():
    # Créer un compte modérateur de test
    client.post("/api/auth/register", json={
        "email": "test_mod@nursery.com",
        "password": "Test1234!",
        "nom": "Modérateur Test",
        "nom_creche": "Crèche Test",
        "capacite": 20
    })
    res = client.post("/api/auth/login", json={
        "email": "test_mod@nursery.com",
        "password": "Test1234!"
    })
    return res.json().get("access_token")

@pytest.fixture
def predict_data():
    return {
        "parents": "usual",
        "has_nurs": "proper",
        "form": "complete",
        "children": "1",
        "housing": "convenient",
        "finance": "convenient",
        "social": "nonprob",
        "health": "recommended"
    }

# ══════════════════════════════════════════════════
#  TESTS MONITORING
# ══════════════════════════════════════════════════
def test_health():
    """API doit retourner status ok"""
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert "model" in res.json()

def test_model_info():
    """Les infos du modèle doivent être disponibles"""
    res = client.get("/api/model-info")
    assert res.status_code == 200
    data = res.json()
    assert "model_name" in data
    assert "metrics" in data

# ══════════════════════════════════════════════════
#  TESTS AUTH
# ══════════════════════════════════════════════════
def test_login_admin_success():
    """Connexion admin doit retourner un token"""
    res = client.post("/api/auth/login", json={
        "email": "admin@nursery.com",
        "password": "Admin1234!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "admin"

def test_login_wrong_password():
    """Mauvais mot de passe doit retourner 401"""
    res = client.post("/api/auth/login", json={
        "email": "admin@nursery.com",
        "password": "mauvais_mdp"
    })
    assert res.status_code == 401

def test_login_wrong_email():
    """Email inexistant doit retourner 401"""
    res = client.post("/api/auth/login", json={
        "email": "inexistant@test.com",
        "password": "Test1234!"
    })
    assert res.status_code == 401

def test_register_success():
    """Inscription doit créer un compte"""
    res = client.post("/api/auth/register", json={
        "email": "nouveau@test.com",
        "password": "Nouveau1234!",
        "nom": "Nouveau User",
        "nom_creche": "Nouvelle Crèche",
        "capacite": 15
    })
    assert res.status_code == 201

def test_register_duplicate_email():
    """Email déjà utilisé doit retourner 400"""
    data = {
        "email": "duplicate@test.com",
        "password": "Test1234!",
        "nom": "User",
        "nom_creche": "Crèche",
        "capacite": 10
    }
    client.post("/api/auth/register", json=data)
    res = client.post("/api/auth/register", json=data)
    assert res.status_code == 400

def test_get_me_without_token():
    """Sans token doit retourner 401"""
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_get_me_with_token(admin_token):
    """Avec token valide doit retourner le profil"""
    res = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res.status_code == 200
    assert "email" in res.json()
    assert "role" in res.json()

# ══════════════════════════════════════════════════
#  TESTS PREDICTIONS ML
# ══════════════════════════════════════════════════
def test_predict_without_token(predict_data):
    """Prédiction sans token doit être refusée"""
    res = client.post("/api/predict", json=predict_data)
    assert res.status_code == 401

def test_predict_with_token(moderateur_token, predict_data):
    """Prédiction avec token valide doit retourner une classe"""
    res = client.post("/api/predict", json=predict_data, headers={
        "Authorization": f"Bearer {moderateur_token}"
    })
    assert res.status_code == 200
    data = res.json()
    assert "prediction" in data
    assert "confidence" in data
    assert "probabilities" in data
    assert data["prediction"] in ["recommend", "very_recom", "priority", "spec_prior", "not_recom"]
    assert 0 <= data["confidence"] <= 1

def test_predict_confidence_range(moderateur_token, predict_data):
    """La confiance doit être entre 0 et 1"""
    res = client.post("/api/predict", json=predict_data, headers={
        "Authorization": f"Bearer {moderateur_token}"
    })
    assert 0 <= res.json()["confidence"] <= 1

def test_predict_probabilities_sum(moderateur_token, predict_data):
    """La somme des probabilités doit être proche de 1"""
    res = client.post("/api/predict", json=predict_data, headers={
        "Authorization": f"Bearer {moderateur_token}"
    })
    total = sum(res.json()["probabilities"].values())
    assert abs(total - 1.0) < 0.01

def test_predict_not_recom(moderateur_token):
    """Profil défavorable doit retourner not_recom"""
    res = client.post("/api/predict", json={
        "parents": "great_pret",
        "has_nurs": "very_crit",
        "form": "foster",
        "children": "more",
        "housing": "critical",
        "finance": "inconv",
        "social": "problematic",
        "health": "not_recom"
    }, headers={"Authorization": f"Bearer {moderateur_token}"})
    assert res.status_code == 200
    assert res.json()["prediction"] == "not_recom"

def test_predict_missing_field(moderateur_token):
    """Champ manquant doit retourner 422"""
    res = client.post("/api/predict", json={
        "parents": "usual",
        "has_nurs": "proper"
        # champs manquants
    }, headers={"Authorization": f"Bearer {moderateur_token}"})
    assert res.status_code == 422

# ══════════════════════════════════════════════════
#  TESTS STATS
# ══════════════════════════════════════════════════
def test_moderateur_stats_without_token():
    """Stats sans token doit retourner 401"""
    res = client.get("/api/moderateur/stats")
    assert res.status_code == 401

def test_moderateur_stats_with_token(moderateur_token):
    """Stats modérateur avec token valide"""
    res = client.get("/api/moderateur/stats", headers={
        "Authorization": f"Bearer {moderateur_token}"
    })
    assert res.status_code == 200
    data = res.json()
    assert "total_predictions" in data
    assert "distribution" in data

def test_admin_stats_with_admin_token(admin_token):
    """Stats admin avec token admin"""
    res = client.get("/api/admin/stats", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res.status_code == 200
    data = res.json()
    assert "total_predictions" in data
    assert "total_creches" in data
    assert "moderateurs" in data

def test_admin_stats_with_moderateur_token(moderateur_token):
    """Stats admin avec token modérateur doit être refusé"""
    res = client.get("/api/admin/stats", headers={
        "Authorization": f"Bearer {moderateur_token}"
    })
    assert res.status_code == 403
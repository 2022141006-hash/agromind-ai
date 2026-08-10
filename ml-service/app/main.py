from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import PredictionRequest, PredictionResponse
from .services.prediction_service import PredictionService

app = FastAPI(
    title="AgroMind AI - Servicio de Predicción ML",
    description="""
    Microservicio de Machine Learning para recomendación de fertilizantes.
    
    ## Funcionalidades
    - **Predicción**: Recibe parámetros de suelo y cultivo → recomienda fertilizante
    - **Modelo**: Random Forest Classifier + Regressor (scikit-learn)
    - **Features**: 10 variables tabulares (cultivo, suelo, temperatura, humedad, pH, N, P, K, MO, CE)
    
    ## Notas
    - Este servicio SOLO realiza predicción. Los datos descriptivos vienen de MariaDB.
    - El backend Node.js orquesta la llamada y enriquece la respuesta.
    """,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize prediction service (loads model at startup)
prediction_service = PredictionService()


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "AgroMind AI - ML Prediction Service",
        "version": "1.0.0",
        "model_loaded": prediction_service.is_loaded,
        "status": "running",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "model_loaded": prediction_service.is_loaded,
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(request: PredictionRequest):
    """
    Predice el fertilizante más adecuado basado en parámetros de suelo y cultivo.
    
    **Parámetros de entrada:**
    - cultivo_id, tipo_suelo_id
    - temperatura (°C), humedad (%), pH
    - nitrogeno, fosforo, potasio (mg/kg)
    - materia_organica (%), conductividad_electrica (dS/m)
    
    **Retorna:**
    - Código del fertilizante recomendado
    - Cantidad sugerida (kg/ha)
    - Nivel de confianza (0-1)
    - Deficiencias detectadas
    - Justificación técnica
    """
    if not prediction_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Modelo ML no disponible. Ejecute el script de entrenamiento: python app/training/train_model.py"
        )
    
    try:
        result = prediction_service.predict(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")


@app.get("/model/info", tags=["Model"])
async def model_info():
    """Información sobre el modelo activo."""
    if not prediction_service.is_loaded:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    
    md = prediction_service.model_data
    return {
        "version": md.get("version"),
        "trained_at": md.get("trained_at"),
        "metrics": md.get("metrics"),
        "classes": md.get("classes"),
        "feature_cols": md.get("feature_cols"),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

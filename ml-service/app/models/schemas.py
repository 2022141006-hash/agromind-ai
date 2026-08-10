from pydantic import BaseModel, Field
from typing import Optional, List


class PredictionRequest(BaseModel):
    cultivo_id: int = Field(..., ge=1, description="ID del cultivo")
    tipo_suelo_id: int = Field(..., ge=1, description="ID del tipo de suelo")
    temperatura: float = Field(..., ge=-10, le=60, description="Temperatura en °C")
    humedad: float = Field(..., ge=0, le=100, description="Humedad relativa en %")
    ph: float = Field(..., ge=0, le=14, description="pH del suelo")
    nitrogeno: float = Field(..., ge=0, le=500, description="Nitrógeno disponible en mg/kg")
    fosforo: float = Field(..., ge=0, le=500, description="Fósforo disponible en mg/kg")
    potasio: float = Field(..., ge=0, le=1000, description="Potasio disponible en mg/kg")
    materia_organica: float = Field(..., ge=0, le=100, description="Materia orgánica en %")
    conductividad_electrica: float = Field(..., ge=0, le=50, description="Conductividad eléctrica en dS/m")

    class Config:
        json_schema_extra = {
            "example": {
                "cultivo_id": 1,
                "tipo_suelo_id": 2,
                "temperatura": 18.5,
                "humedad": 72.0,
                "ph": 6.2,
                "nitrogeno": 45.0,
                "fosforo": 28.0,
                "potasio": 180.0,
                "materia_organica": 3.5,
                "conductividad_electrica": 1.2
            }
        }


class TopPrediccion(BaseModel):
    codigo: str
    probabilidad: float


class PredictionResponse(BaseModel):
    fertilizante_codigo: str
    cantidad_kg: float
    confianza: float
    deficiencias: List[str]
    justificacion: str
    top_3_predicciones: Optional[List[TopPrediccion]] = None

import os
import joblib
import numpy as np
from typing import Optional
from ..models.schemas import PredictionRequest, PredictionResponse, TopPrediccion


class PredictionService:
    def __init__(self):
        self.model_data: Optional[dict] = None
        self._load_model()

    def _load_model(self):
        """Load trained model from artifacts directory."""
        possible_paths = [
            # Root ml-service/artifacts/ (Primary)
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'artifacts', 'agromind_model_v1.joblib')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'training', 'artifacts', 'agromind_model_v1.joblib')),
            os.path.abspath(os.path.join(os.getcwd(), 'artifacts', 'agromind_model_v1.joblib')),
            'artifacts/agromind_model_v1.joblib',
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                try:
                    self.model_data = joblib.load(path)
                    print(f"✅ Modelo ML cargado exitosamente desde: {path}")
                    print(f"   Versión: {self.model_data.get('version', 'N/A')}")
                    print(f"   Test Accuracy: {self.model_data['metrics']['test_accuracy']:.4f}")
                    return
                except Exception as e:
                    print(f"❌ Error cargando modelo desde {path}: {e}")
        
        print("⚠️  Modelo no encontrado en las rutas especificadas. Ejecutar: python app/training/train_model.py")

    @property
    def is_loaded(self) -> bool:
        if self.model_data is None:
            self._load_model()
        return self.model_data is not None

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        if not self.is_loaded:
            raise RuntimeError("Modelo no cargado. Ejecute el script de entrenamiento primero.")

        clf = self.model_data['classifier']
        reg = self.model_data['regressor']
        le = self.model_data['label_encoder']

        # Build feature vector
        features = np.array([[
            request.cultivo_id,
            request.tipo_suelo_id,
            request.temperatura,
            request.humedad,
            request.ph,
            request.nitrogeno,
            request.fosforo,
            request.potasio,
            request.materia_organica,
            request.conductividad_electrica,
        ]])

        # Classification prediction
        probabilities = clf.predict_proba(features)[0]
        predicted_class_idx = np.argmax(probabilities)
        fertilizante_codigo = le.inverse_transform([predicted_class_idx])[0]
        confianza = float(probabilities[predicted_class_idx])

        # Regression prediction (dose)
        cantidad_kg = float(reg.predict(features)[0])
        cantidad_kg = max(0, round(cantidad_kg, 1))

        # Detect deficiencies
        deficiencias = self._detect_deficiencies(request)

        # Build justification
        justificacion = self._build_justification(request, fertilizante_codigo, deficiencias, confianza)

        # Top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_3 = [
            TopPrediccion(
                codigo=le.inverse_transform([idx])[0],
                probabilidad=round(float(probabilities[idx]), 4)
            )
            for idx in top_indices
        ]

        return PredictionResponse(
            fertilizante_codigo=fertilizante_codigo,
            cantidad_kg=cantidad_kg,
            confianza=round(confianza, 4),
            deficiencias=deficiencias,
            justificacion=justificacion,
            top_3_predicciones=top_3,
        )

    def _detect_deficiencies(self, req: PredictionRequest) -> list:
        deficiencias = []
        if req.nitrogeno < 20:
            deficiencias.append('Deficiencia crítica de Nitrógeno (N < 20 mg/kg)')
        elif req.nitrogeno < 40:
            deficiencias.append('Deficiencia moderada de Nitrógeno (N < 40 mg/kg)')
        if req.fosforo < 10:
            deficiencias.append('Deficiencia crítica de Fósforo (P < 10 mg/kg)')
        elif req.fosforo < 20:
            deficiencias.append('Deficiencia moderada de Fósforo (P < 20 mg/kg)')
        if req.potasio < 80:
            deficiencias.append('Deficiencia crítica de Potasio (K < 80 mg/kg)')
        elif req.potasio < 150:
            deficiencias.append('Deficiencia moderada de Potasio (K < 150 mg/kg)')
        if req.materia_organica < 1.5:
            deficiencias.append('Contenido muy bajo de Materia Orgánica (< 1.5%)')
        if req.ph < 5.0:
            deficiencias.append('pH muy ácido (< 5.0) — requiere encalado')
        elif req.ph > 8.0:
            deficiencias.append('pH muy alcalino (> 8.0) — requiere corrección')
        if req.conductividad_electrica > 4.0:
            deficiencias.append('Salinidad elevada (CE > 4 dS/m) — riesgo fitotóxico')
        return deficiencias

    def _build_justification(self, req: PredictionRequest, codigo: str, deficiencias: list, confianza: float) -> str:
        parts = [
            f"El modelo de IA (Random Forest) analizó 10 parámetros agronómicos y determinó "
            f"con {confianza*100:.1f}% de confianza que {codigo} es el fertilizante más adecuado."
        ]
        
        nutrient_issues = []
        if req.nitrogeno < 40:
            nutrient_issues.append(f"N bajo ({req.nitrogeno} mg/kg)")
        if req.fosforo < 20:
            nutrient_issues.append(f"P bajo ({req.fosforo} mg/kg)")
        if req.potasio < 150:
            nutrient_issues.append(f"K bajo ({req.potasio} mg/kg)")
        
        if nutrient_issues:
            parts.append(f"Se detectaron niveles bajos de: {', '.join(nutrient_issues)}.")
        
        if req.ph < 5.5:
            parts.append(f"El pH ácido ({req.ph}) reduce la disponibilidad de nutrientes. Se recomienda corrección previa.")
        elif req.ph > 7.5:
            parts.append(f"El pH alcalino ({req.ph}) puede precipitar el fósforo. Se prefieren fuentes acidificantes.")
        
        if req.materia_organica < 2.0:
            parts.append(f"La baja materia orgánica ({req.materia_organica}%) limita la actividad microbiana y la retención de nutrientes.")
        
        parts.append(f"Las condiciones de temperatura ({req.temperatura}°C) y humedad ({req.humedad}%) son {'favorables' if 10 <= req.temperatura <= 35 and 50 <= req.humedad <= 85 else 'subóptimas'} para la disponibilidad de nutrientes.")
        
        return " ".join(parts)

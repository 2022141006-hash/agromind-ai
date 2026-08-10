"""
AgroMind AI - Model Training Script
=====================================
Entrena un modelo Random Forest para recomendación de fertilizantes.
Dataset: Datos agronómicos sintéticos basados en literatura científica
         para cultivos andinos y tropicales de Perú.

Ejecutar: python train_model.py
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, mean_absolute_error
import joblib
import os
import sys
import json
from datetime import datetime

# Set stdout encoding for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


# ── Mapping: (cultivo_id, tipo_suelo_id) → fertilizante_codigo esperado ──
# Basado en recomendaciones agronómicas reales para Perú
FERTILIZER_RULES = {
    # Papa (id=1) - Alta demanda de N, P, K
    (1, 1): 'NPK-15-15-15',  # Arcilloso → NPK balanceado
    (1, 2): 'NPK-12-24-12',  # Franco → Alto P para raíces
    (1, 3): 'UREA-46',       # Arenoso → Nitrógeno rápido
    (1, 4): 'NPK-15-15-15',
    (1, 5): 'DAP-18-46',
    # Maíz (id=2) - Alta demanda de N
    (2, 1): 'UREA-46',
    (2, 2): 'UREA-46',
    (2, 3): 'NIT-27',        # Arenoso → Nitrato amónico (menos lixiviación)
    (2, 4): 'NPK-15-15-15',
    (2, 5): 'SA-21',
    # Quinua (id=3) - Moderada demanda
    (3, 1): 'NPK-15-15-15',
    (3, 2): 'SA-21',
    (3, 3): 'NPK-15-15-15',
    # Arroz (id=4) - Alta N, suelos inundados
    (4, 1): 'UREA-46',
    (4, 2): 'UREA-46',
    (4, 4): 'SA-21',
    # Trigo (id=5)
    (5, 1): 'UREA-46',
    (5, 2): 'NPK-15-15-15',
    (5, 6): 'SA-21',
    # Tomate (id=6) - Alta demanda total
    (6, 2): 'NPK-10-26-26',  # Franco → Alto P-K frutas
    (6, 3): 'KNO3-13-46',    # Arenoso → Nitrato potasio
    (6, 4): 'NPK-10-26-26',
    # Cebolla (id=7)
    (7, 2): 'NPK-15-15-15',
    (7, 3): 'DAP-18-46',
    # Espárrago (id=8)
    (8, 2): 'NPK-15-15-15',
    (8, 3): 'KCL-60',
    # Café (id=9) - Suelos ácidos
    (9, 7): 'HUMUS-ORG',     # Orgánico → Humus
    (9, 2): 'NPK-12-24-12',
    # Cacao (id=10)
    (10, 7): 'HUMUS-ORG',
    (10, 4): 'NPK-15-15-15',
    # Caña de azúcar (id=11) - Alta N, K
    (11, 1): 'UREA-46',
    (11, 2): 'KCL-60',
    # Palto (id=12)
    (12, 2): 'NPK-15-15-15',
    (12, 3): 'KNO3-13-46',
}

# Todos los fertilizantes disponibles
ALL_FERTILIZERS = [
    'UREA-46', 'SA-21', 'NIT-27', 'DAP-18-46', 'MAP-12-61', 'SF-0-20',
    'KCL-60', 'KNO3-13-46', 'NPK-15-15-15', 'NPK-12-24-12', 'NPK-10-26-26',
    'FOL-N-30', 'FOL-NPK-20-20-20', 'HUMUS-ORG', 'LIB-LENTA-NPK', 'BIO-RHIZO'
]

# Dosis típicas por fertilizante (kg/ha)
DOSE_MAP = {
    'UREA-46': (100, 250), 'SA-21': (150, 350), 'NIT-27': (80, 200),
    'DAP-18-46': (100, 250), 'MAP-12-61': (80, 180), 'SF-0-20': (100, 300),
    'KCL-60': (100, 300), 'KNO3-13-46': (50, 150), 'NPK-15-15-15': (150, 400),
    'NPK-12-24-12': (100, 300), 'NPK-10-26-26': (100, 250),
    'FOL-N-30': (2, 5), 'FOL-NPK-20-20-20': (1, 3),
    'HUMUS-ORG': (2000, 5000), 'LIB-LENTA-NPK': (100, 200), 'BIO-RHIZO': (1, 5),
}


def get_fertilizer_for_conditions(row: pd.Series) -> str:
    """Determine fertilizer based on agronomic rules + soil/nutrient conditions."""
    cid = int(row['cultivo_id'])
    sid = int(row['tipo_suelo_id'])
    
    # Rule-based override by soil nutrient conditions
    n = row['nitrogeno']
    p = row['fosforo']
    k = row['potasio']
    ph = row['ph']
    mo = row['materia_organica']
    
    # Critical deficiencies override base rule
    if n < 20 and p < 15 and k < 100:
        return 'NPK-15-15-15'
    if p < 10 and n < 30:
        return 'DAP-18-46'
    if n < 15:
        return 'UREA-46'
    if k < 80 and n > 30:
        return 'KCL-60'
    if mo < 1.5 and ph < 5.5:
        return 'HUMUS-ORG'
    if ph > 7.5 and p < 20:
        return 'MAP-12-61'
    if n > 60 and p > 40 and k < 100:
        return 'KCL-60'
    if n > 60 and p > 40 and k > 200:
        return 'KNO3-13-46'
    
    # Default: lookup rule table
    key = (cid, sid)
    if key in FERTILIZER_RULES:
        return FERTILIZER_RULES[key]
    
    # Fallback based on dominant deficiency
    if n < p and n < k:
        return 'UREA-46'
    if p < n and p < k:
        return 'DAP-18-46'
    return 'NPK-15-15-15'


def detect_deficiencies(row: pd.Series) -> list:
    """Detect nutrient deficiencies based on thresholds."""
    deficiencies = []
    if row['nitrogeno'] < 20:
        deficiencies.append('Deficiencia crítica de Nitrógeno (N)')
    elif row['nitrogeno'] < 40:
        deficiencies.append('Deficiencia moderada de Nitrógeno (N)')
    if row['fosforo'] < 10:
        deficiencies.append('Deficiencia crítica de Fósforo (P)')
    elif row['fosforo'] < 20:
        deficiencies.append('Deficiencia moderada de Fósforo (P)')
    if row['potasio'] < 80:
        deficiencies.append('Deficiencia crítica de Potasio (K)')
    elif row['potasio'] < 150:
        deficiencies.append('Deficiencia moderada de Potasio (K)')
    if row['materia_organica'] < 1.5:
        deficiencies.append('Muy bajo contenido de Materia Orgánica')
    if row['ph'] < 5.0:
        deficiencies.append('pH muy ácido — necesario encalado')
    elif row['ph'] > 8.0:
        deficiencies.append('pH muy alcalino — aplicar azufre')
    if row['conductividad_electrica'] > 4.0:
        deficiencies.append('Salinidad elevada — riesgo de fitotoxicidad')
    return deficiencies


def generate_dataset(n_samples: int = 800) -> pd.DataFrame:
    """Generate realistic agronomic training dataset."""
    np.random.seed(42)
    records = []
    
    cultivos = list(range(1, 13))  # 12 cultivos
    suelos = list(range(1, 9))     # 8 tipos de suelo
    
    for _ in range(n_samples):
        cid = np.random.choice(cultivos)
        sid = np.random.choice(suelos)
        
        # Realistic ranges per condition
        temperatura = np.random.normal(18, 6)
        temperatura = np.clip(temperatura, 5, 40)
        
        humedad = np.random.normal(65, 18)
        humedad = np.clip(humedad, 20, 95)
        
        ph = np.random.normal(6.2, 0.9)
        ph = np.clip(ph, 4.0, 8.5)
        
        # Nutrient levels: simulate realistic Peruvian soils
        nitrogeno = np.random.exponential(40) + np.random.normal(10, 5)
        nitrogeno = np.clip(nitrogeno, 2, 200)
        
        fosforo = np.random.exponential(25) + np.random.normal(5, 3)
        fosforo = np.clip(fosforo, 1, 150)
        
        potasio = np.random.normal(180, 80)
        potasio = np.clip(potasio, 30, 600)
        
        materia_organica = np.random.exponential(2.5) + 0.5
        materia_organica = np.clip(materia_organica, 0.3, 15)
        
        conductividad = np.random.exponential(1.5)
        conductividad = np.clip(conductividad, 0.1, 12)
        
        row = pd.Series({
            'cultivo_id': cid, 'tipo_suelo_id': sid,
            'temperatura': round(temperatura, 2),
            'humedad': round(humedad, 2),
            'ph': round(ph, 2),
            'nitrogeno': round(nitrogeno, 2),
            'fosforo': round(fosforo, 2),
            'potasio': round(potasio, 2),
            'materia_organica': round(materia_organica, 3),
            'conductividad_electrica': round(conductividad, 3),
        })
        
        fertilizer = get_fertilizer_for_conditions(row)
        dose_range = DOSE_MAP.get(fertilizer, (100, 250))
        dose = round(np.random.uniform(dose_range[0], dose_range[1]), 1)
        
        record = row.to_dict()
        record['fertilizante_codigo'] = fertilizer
        record['cantidad_kg'] = dose
        records.append(record)
    
    df = pd.DataFrame(records)
    return df


def train():
    print("🌱 AgroMind AI - Entrenamiento del Modelo")
    print("=" * 50)
    
    # 1. Generate dataset
    print("📊 Generando dataset de entrenamiento...")
    df = generate_dataset(2500)
    print(f"   Dataset: {len(df)} muestras, {df['fertilizante_codigo'].nunique()} clases")
    
    # Save dataset
    os.makedirs('artifacts', exist_ok=True)
    df.to_csv('artifacts/training_dataset.csv', index=False)
    print("   Dataset guardado en artifacts/training_dataset.csv")
    
    # 2. Prepare features
    feature_cols = ['cultivo_id', 'tipo_suelo_id', 'temperatura', 'humedad', 
                    'ph', 'nitrogeno', 'fosforo', 'potasio', 
                    'materia_organica', 'conductividad_electrica']
    X = df[feature_cols].values
    
    # 3. Encode target (classifier)
    le = LabelEncoder()
    y_class = le.fit_transform(df['fertilizante_codigo'])
    y_dose = df['cantidad_kg'].values
    
    # 4. Train/test split
    X_train, X_test, yc_train, yc_test, yd_train, yd_test = train_test_split(
        X, y_class, y_dose, test_size=0.2, random_state=42
    )

    
    # 5. Train classifier (RandomForest)
    print("\n🤖 Entrenando RandomForestClassifier...")
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=3,
        min_samples_leaf=1,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, yc_train)
    
    # Cross-validation
    cv_scores = cross_val_score(clf, X_train, yc_train, cv=5, scoring='accuracy')
    test_acc = clf.score(X_test, yc_test)
    print(f"   CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"   Test Accuracy: {test_acc:.4f}")
    print("\n" + classification_report(yc_test, clf.predict(X_test), target_names=le.classes_))
    
    # 6. Train regressor (RandomForest for dose)
    print("📏 Entrenando RandomForestRegressor (cantidad)...")
    reg = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        n_jobs=-1
    )
    reg.fit(X_train, yd_train)
    mae = mean_absolute_error(yd_test, reg.predict(X_test))
    print(f"   MAE Dosis: {mae:.2f} kg/ha")
    
    # 7. Save models
    model_data = {
        'classifier': clf,
        'regressor': reg,
        'label_encoder': le,
        'feature_cols': feature_cols,
        'metrics': {
            'cv_accuracy_mean': float(cv_scores.mean()),
            'cv_accuracy_std': float(cv_scores.std()),
            'test_accuracy': float(test_acc),
            'dose_mae': float(mae),
        },
        'classes': list(le.classes_),
        'trained_at': datetime.now().isoformat(),
        'version': '1.0.0',
    }
    
    model_path = 'artifacts/agromind_model_v1.joblib'
    joblib.dump(model_data, model_path)
    print(f"\n✅ Modelo guardado en: {model_path}")
    
    # Save metrics
    with open('artifacts/metrics.json', 'w') as f:
        json.dump(model_data['metrics'], f, indent=2)
    
    print("\n🎯 Entrenamiento completado exitosamente")
    print(f"   Clases: {list(le.classes_)}")
    return model_data


if __name__ == '__main__':
    train()

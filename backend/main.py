from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Enhanced CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Match your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data with error handling
try:
    df = pd.read_csv("telemetry.csv")
except FileNotFoundError:
    raise RuntimeError("Telemetry file not found!")

@app.get("/telemetry")
async def get_telemetry():
    return df.to_dict(orient="records")

@app.get("/anomalies")
async def get_anomalies():
    anomalies = []
    for index, row in df.iterrows():
        if not (20 <= row['temperature'] <= 25):
            anomalies.append({
                "index": index,
                "sensor": "temperature",
                "value": float(row['temperature']),
                "time": float(row['time'])
            })
        if not (91.1925 <= row['pressure'] <= 101.3):
            anomalies.append({
                "index": index,
                "sensor": "pressure", 
                "value": float(row['pressure']),
                "time": float(row['time'])
            })
    return {"anomalies": anomalies}
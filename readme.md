# Unicorn Space - 20

## Problem Statement 5 - Spacecraft Telemetry Analyzer 

### Running Commands
Frontend
```
pnpm run dev
```

Backend
```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Dependencies
```
pnpm i
pip install pandas
pip install fastapi
```

### Expected Input
- A File that contains  CSV with header row (e.g., time,temperature,pressure), followed by rows of data: 
▪ time: Floating-point (0 ≤ time ≤ 1000, seconds). 
▪ temperature: Floating-point (-50 ≤ temperature ≤ 200, °C). 
▪ pressure: Floating-point (0 ≤ pressure ≤ 2, atm).

- File name : telemetry.csv
- How to navigate to file - backend/telemetry.csv

### Expected Output
- A file that contains one line per anomaly, space-separated: index sensor value. 

- File name : anomalies.txt
- How to navigate to file - backend/anomalies.txt




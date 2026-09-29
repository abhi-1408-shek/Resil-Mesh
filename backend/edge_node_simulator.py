import asyncio
import json
import random
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Resil-Mesh Edge Node Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global State for the Simulator ---
# This simulates the current physical readings before AI processing on the Edge Node.
state = {
    "thermal": {"temperature": 35.0}, # Normal ~35C
    "structural": {"crack_displacement_mm": 0.5}, # Normal < 2.0mm
    "acoustic": {"profile": "Laminar Flow (Clear)"} # Normal: Laminar
}

# Keep track of connected WebSocket clients (dashboard)
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except WebSocketDisconnect:
                self.disconnect(connection)
            except Exception:
                pass

manager = ConnectionManager()

# --- Request Models ---
class HazardTrigger(BaseModel):
    hazard_type: str # 'thermal', 'structural', 'acoustic'
    
# --- Endpoints ---
@app.post("/trigger-hazard")
async def trigger_hazard(trigger: HazardTrigger):
    """
    Manually inject spikes in the data stream for demonstration purposes.
    """
    if trigger.hazard_type == "thermal":
        state["thermal"]["temperature"] = 72.5 # Critical > 65C
        return {"status": "success", "message": "Thermal spike triggered."}
    elif trigger.hazard_type == "structural":
        state["structural"]["crack_displacement_mm"] = 2.4 # Critical > 2.0mm
        return {"status": "success", "message": "Crack progression simulated."}
    elif trigger.hazard_type == "acoustic":
        state["acoustic"]["profile"] = "Turbulent/Choked"
        return {"status": "success", "message": "Drain choke triggered."}
    return {"status": "error", "message": "Invalid hazard type."}

@app.post("/reset-simulation")
async def reset_simulation():
    """Reset the sensor values back to normal."""
    state["thermal"]["temperature"] = 35.0
    state["structural"]["crack_displacement_mm"] = 0.5
    state["acoustic"]["profile"] = "Laminar Flow (Clear)"
    return {"status": "success"}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    """
    Continuously streams telemetry data to the dashboard.
    This simulates the edge node broadcasting its processed output.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Simulate slight natural fluctuations in normal data if not in critical state
            if state["thermal"]["temperature"] < 65.0:
                state["thermal"]["temperature"] += random.uniform(-0.5, 0.5)
            
            if state["structural"]["crack_displacement_mm"] < 2.0:
                state["structural"]["crack_displacement_mm"] += random.uniform(-0.05, 0.05)
                # Keep it positive
                state["structural"]["crack_displacement_mm"] = max(0.0, state["structural"]["crack_displacement_mm"])

            # Construct Payload
            # *Note: In a real scenario, this represents the output AFTER local AI inference on the Edge Device.*
            payload = {
                "timestamp": datetime.now().isoformat(),
                "node_id": "jammu-edge-mubarak-01",
                "network_status": "LoRa Mesh Active",
                "processing_mode": "Local/Offline",
                "sensors": {
                    "thermal": {
                        "temperature": round(state["thermal"]["temperature"], 2),
                        "status": "Critical" if state["thermal"]["temperature"] > 65.0 else "Normal",
                        "route_recommendation": "Dispatching Two-Wheeler Mist Unit via Narrow Lane Alpha" if state["thermal"]["temperature"] > 65.0 else None
                    },
                    "structural": {
                        "crack_displacement_mm": round(state["structural"]["crack_displacement_mm"], 2),
                        "status": "Warning" if state["structural"]["crack_displacement_mm"] > 2.0 else "Normal",
                        "alert_msg": "Structural Audit Required at Mubarak Mandi Heritage Site" if state["structural"]["crack_displacement_mm"] > 2.0 else None
                    },
                    "acoustic": {
                        "profile": state["acoustic"]["profile"],
                        "status": "Critical" if state["acoustic"]["profile"] == "Turbulent/Choked" else "Normal"
                    }
                }
            }
            
            await manager.broadcast(json.dumps(payload))
            await asyncio.sleep(1) # Broadcast every 1 second
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

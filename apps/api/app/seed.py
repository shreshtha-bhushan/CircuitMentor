"""Seed the parts catalog with the initial 6 components."""

from __future__ import annotations

import asyncio

from sqlalchemy import select

from app.db import async_session, engine
from app.models import Base, Part

SEED_PARTS = [
    {
        "part_id": "resistor.axial",
        "name": "Resistor",
        "category": "passive",
        "description": "Axial through-hole resistor. Limits current and divides voltage.",
        "symbol_svg": '<rect x="-20" y="-6" width="40" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/>',
        "params_schema": {
            "resistance": {"type": "number", "unit": "Ω", "default": 220, "min": 0.1, "max": 10e6},
            "tolerance": {"type": "enum", "options": ["1%", "5%", "10%"], "default": "5%"},
            "power": {"type": "number", "unit": "W", "default": 0.25},
        },
        "pins": {
            "1": {"name": "1", "electrical": "passive", "offset": {"x": -30, "y": 0}},
            "2": {"name": "2", "electrical": "passive", "offset": {"x": 30, "y": 0}},
        },
    },
    {
        "part_id": "led.5mm.red",
        "name": "LED",
        "category": "semiconductor",
        "description": "5mm red LED. Forward voltage ~2.0V, max current 20mA.",
        "symbol_svg": '<polygon points="-8,-10 -8,10 12,0" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="-10" x2="12" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="-14" x2="22" y2="-18" stroke="currentColor" stroke-width="1" marker-end="url(#arrow)"/><line x1="16" y1="-8" x2="22" y2="-12" stroke="currentColor" stroke-width="1" marker-end="url(#arrow)"/>',
        "params_schema": {
            "color": {"type": "enum", "options": ["red", "green", "blue", "yellow", "white"], "default": "red"},
            "vf": {"type": "number", "unit": "V", "default": 2.0, "min": 1.6, "max": 3.6},
            "if_max": {"type": "number", "unit": "mA", "default": 20},
        },
        "pins": {
            "anode": {"name": "anode", "electrical": "passive", "offset": {"x": -20, "y": 0}},
            "cathode": {"name": "cathode", "electrical": "passive", "offset": {"x": 20, "y": 0}},
        },
    },
    {
        "part_id": "battery.9v",
        "name": "9V Battery",
        "category": "power",
        "description": "9V battery power source.",
        "symbol_svg": '<line x1="-4" y1="-12" x2="-4" y2="12" stroke="currentColor" stroke-width="3"/><line x1="4" y1="-8" x2="4" y2="8" stroke="currentColor" stroke-width="1.5"/>',
        "params_schema": {
            "voltage": {"type": "number", "unit": "V", "default": 9},
        },
        "pins": {
            "positive": {"name": "+", "electrical": "power_out", "offset": {"x": 0, "y": -20}},
            "negative": {"name": "−", "electrical": "power_out", "offset": {"x": 0, "y": 20}},
        },
    },
    {
        "part_id": "switch.spst",
        "name": "Switch",
        "category": "passive",
        "description": "Single-pole single-throw toggle switch.",
        "symbol_svg": '<circle cx="-12" cy="0" r="3" fill="currentColor"/><circle cx="12" cy="0" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="-9" y1="0" x2="10" y2="-8" stroke="currentColor" stroke-width="1.5"/>',
        "params_schema": {
            "state": {"type": "enum", "options": ["open", "closed"], "default": "open"},
        },
        "pins": {
            "1": {"name": "1", "electrical": "passive", "offset": {"x": -20, "y": 0}},
            "2": {"name": "2", "electrical": "passive", "offset": {"x": 20, "y": 0}},
        },
    },
    {
        "part_id": "ground",
        "name": "Ground",
        "category": "power",
        "description": "Ground reference node (0V).",
        "symbol_svg": '<line x1="0" y1="-8" x2="0" y2="0" stroke="currentColor" stroke-width="1.5"/><line x1="-10" y1="0" x2="10" y2="0" stroke="currentColor" stroke-width="1.5"/><line x1="-6" y1="4" x2="6" y2="4" stroke="currentColor" stroke-width="1.5"/><line x1="-2" y1="8" x2="2" y2="8" stroke="currentColor" stroke-width="1.5"/>',
        "params_schema": {},
        "pins": {
            "gnd": {"name": "GND", "electrical": "power_in", "offset": {"x": 0, "y": -12}},
        },
    },
    {
        "part_id": "capacitor.ceramic",
        "name": "Capacitor",
        "category": "passive",
        "description": "Ceramic capacitor. Stores charge and filters signals.",
        "symbol_svg": '<line x1="-3" y1="-10" x2="-3" y2="10" stroke="currentColor" stroke-width="2"/><line x1="3" y1="-10" x2="3" y2="10" stroke="currentColor" stroke-width="2"/>',
        "params_schema": {
            "capacitance": {"type": "number", "unit": "F", "default": 0.0000001, "min": 1e-12, "max": 0.01},
            "voltage_rating": {"type": "number", "unit": "V", "default": 50},
        },
        "pins": {
            "1": {"name": "1", "electrical": "passive", "offset": {"x": -12, "y": 0}},
            "2": {"name": "2", "electrical": "passive", "offset": {"x": 12, "y": 0}},
        },
    },
    {
        "part_id": "pushbutton",
        "name": "Pushbutton",
        "category": "passive",
        "description": "Momentary pushbutton switch. Normally open.",
        "symbol_svg": '<circle cx="-12" cy="0" r="2" fill="currentColor"/><circle cx="12" cy="0" r="2" fill="currentColor"/><line x1="-12" y1="-6" x2="12" y2="-6" stroke="currentColor" stroke-width="1.5"/><line x1="0" y1="-6" x2="0" y2="-12" stroke="currentColor" stroke-width="1.5"/>',
        "params_schema": {},
        "pins": {
            "1a": {"name": "1a", "electrical": "passive", "offset": {"x": -20, "y": 0}},
            "2a": {"name": "2a", "electrical": "passive", "offset": {"x": 20, "y": 0}},
        },
    },
    {
        "part_id": "potentiometer",
        "name": "Potentiometer",
        "category": "passive",
        "description": "Variable resistor with a wiper.",
        "symbol_svg": '<rect x="-20" y="-6" width="40" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="0" y1="-14" x2="0" y2="-6" stroke="currentColor" stroke-width="1.5"/><polygon points="-4,-6 4,-6 0,-10" fill="currentColor"/>',
        "params_schema": {
            "resistance": {"type": "number", "unit": "Ω", "default": 10000, "min": 100, "max": 1e6},
            "position": {"type": "number", "unit": "%", "default": 50, "min": 0, "max": 100},
        },
        "pins": {
            "1": {"name": "1", "electrical": "passive", "offset": {"x": -30, "y": 0}},
            "wiper": {"name": "W", "electrical": "passive", "offset": {"x": 0, "y": -20}},
            "2": {"name": "2", "electrical": "passive", "offset": {"x": 30, "y": 0}},
        },
    },
    {
        "part_id": "arduino.uno",
        "name": "Arduino Uno R3",
        "category": "mcu",
        "description": "ATmega328P-based development board. 14 digital I/O, 6 analog inputs.",
        "symbol_svg": '<rect x="-30" y="-40" width="60" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="0" y="4" text-anchor="middle" fill="currentColor" font-size="8" font-family="monospace">UNO</text>',
        "params_schema": {
            "clock": {"type": "number", "unit": "MHz", "default": 16},
        },
        "pins": {
            "D0": {"name": "D0", "electrical": "bidir", "offset": {"x": 35, "y": -32}},
            "D1": {"name": "D1", "electrical": "bidir", "offset": {"x": 35, "y": -24}},
            "D13": {"name": "D13", "electrical": "bidir", "offset": {"x": 35, "y": 32}},
            "5V": {"name": "5V", "electrical": "power_out", "offset": {"x": -35, "y": -32}},
            "GND": {"name": "GND", "electrical": "power_out", "offset": {"x": -35, "y": -24}},
            "A0": {"name": "A0", "electrical": "input", "offset": {"x": -35, "y": 16}},
        },
    },
]


async def seed():
    """Insert seed parts if they don't already exist."""
    async with async_session() as session:
        async with session.begin():
            # Ensure tables exist
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            for part_data in SEED_PARTS:
                existing = await session.execute(
                    select(Part).where(Part.part_id == part_data["part_id"])
                )
                if not existing.scalar_one_or_none():
                    session.add(Part(**part_data))
                    print(f"  ✓ Seeded {part_data['name']} ({part_data['part_id']})")
                else:
                    print(f"  · Already exists: {part_data['name']}")

    print("\nSeed complete.")


if __name__ == "__main__":
    asyncio.run(seed())

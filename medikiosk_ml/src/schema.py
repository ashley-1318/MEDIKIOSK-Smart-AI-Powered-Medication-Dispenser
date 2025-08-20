from __future__ import annotations
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class Person(BaseModel):
    name: str = ""
    age: Optional[int] = None
    id: str = ""


class Prescriber(BaseModel):
    name: str = ""
    reg_no: str = ""
    signature_present: bool = False


class Item(BaseModel):
    drug_generic: str = ""
    drug_brand: str = ""
    strength: str = ""
    dose: str = ""
    frequency: str = ""
    duration: str = ""
    route: str = ""
    instructions: str = ""
    otc_or_rx: str = ""
    confidence: float = 0.0
    conf: Dict[str, float] = Field(default_factory=dict)


class Verification(BaseModel):
    in_stock: bool = False
    dose_within_guidelines: bool = True
    policy_flags: List[str] = Field(default_factory=list)


class Prescription(BaseModel):
    patient: Person = Field(default_factory=Person)
    prescriber: Prescriber = Field(default_factory=Prescriber)
    prescription_date: str = ""
    items: List[Item] = Field(default_factory=list)
    verification: Verification = Field(default_factory=Verification)

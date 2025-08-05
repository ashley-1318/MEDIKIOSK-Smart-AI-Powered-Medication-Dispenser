# 💊 MEDIKIOSK – Smart AI-Powered Medication Dispenser

> 🚀 A complete AI-integrated smart medication dispensing system that automates prescription scanning, medicine validation, and secure dispensing using OCR, AI, and Arduino-based hardware.

---

## 🧠 Project Overview

**MEDIKIOSK** is an AI-driven medication dispenser designed to automate the process of delivering medicines based on prescriptions. This smart kiosk verifies prescriptions using OCR and AI, maps medicines, and uses Arduino hardware to dispense the correct pills securely. Ideal for clinics, pharmacies, and remote healthcare centers.

---

## ✨ Key Features

- 📸 **OCR Prescription Scanning**  
  Upload or capture prescriptions and extract text using Tesseract OCR.

- 🧠 **AI-Based Verification**  
  Validates prescription details, dosage, and maps to available stock.

- 🤖 **Automated Dispensing Mechanism**  
  Arduino Mega 2560-based system with multiple medicine slots and servo motors.

- 🔒 **User Authentication**  
  Secure access via OTP, RFID, or biometric authentication.

- 📈 **Inventory Management System**  
  Real-time tracking of stock with refill alerts and logs.

- 📱 **Flutter-Based Mobile UI**  
  Cross-platform app for user interaction, monitoring, and admin access.

- 🔔 **Smart Notifications**  
  Sends alerts to users and admins via email, SMS, or push notifications.

---

## 📱 Screenshots

| User Flow | Admin Dashboard | Hardware |
|----------|----------------|----------|
| ![upload](assets/screens/upload.png) | ![admin](assets/screens/admin.png) | ![hardware](assets/screens/hardware.png) |

---

## 🛠️ Tech Stack

| Layer           | Technology Used                         |
|----------------|------------------------------------------|
| **Frontend**    | Flutter (Dart)                           |
| **Backend**     | Python Flask / FastAPI                  |
| **AI & OCR**    | Tesseract OCR, NLP for prescription parsing |
| **Database**    | Firebase / MongoDB / MySQL              |
| **Hardware**    | Arduino Mega 2560, Servo Motors, IR Sensors |
| **Notifications**| Firebase Cloud Messaging / Twilio      |

---

## 🔄 Project Architecture

```plaintext
[Flutter App] ⇄ [Flask Backend API] ⇄ [OCR + AI Engine]
                           ⇅
                     [Arduino Hardware]
                           ⇅
                    [Inventory Database]

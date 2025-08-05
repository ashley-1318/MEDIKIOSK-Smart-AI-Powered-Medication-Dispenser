# AI-Powered Smart Medication Dispenser (MEDIKIOSK)

![Project Status](https://img.shields.io/badge/status-conceptual-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

This repository contains the conceptual framework and documentation for the **AI-Powered Smart Medication Dispenser (MEDIKIOSK)**, based on the invention detailed in Indian Patent Application Form 2. The system is designed to be a robotic medication management solution that integrates artificial intelligence, secure authentication, and real-time monitoring to automate the drug dispensing process.

## 🎯 The Problem

In many countries, the traditional method of dispensing drugs relies on pharmacists interpreting handwritten prescriptions. This process can be slow, inefficient, and prone to human errors, especially when dealing with illegible handwriting. While sophisticated hospitals may use digital prescriptions, handwritten ones are still prevalent in developing or under-developed nations. This creates a significant challenge in providing safe and timely access to medications, particularly in remote areas.

## ✨ Key Features

The MEDIKIOSK system is designed with the following core features:

* **AI-Powered Prescription Analysis:**
    * Employs Optical Character Recognition (OCR) and Artificial Intelligence (AI) to scan, read, and validate handwritten and digital prescriptions.
    * The system is trained through Machine Learning (ML) to read handwritten prescriptions with high accuracy.
    * It cross-verifies extracted drug names, dosages, and frequencies with a secure medical database to ensure accuracy and prevent conflicts.

* **Secure Multi-Factor Authentication:**
    * Ensures secure access through biometric methods (fingerprint or facial recognition) or OTP-based validation sent to a user's registered mobile number or email.
    * After multiple failed authentication attempts, an alert is sent to an administrator or caregiver.

* **Robotic Dispensing & Verification:**
    * A robotic arm with a gripper or a vibrating pill tray autonomously collects the correct medication from designated storage slots.
    * The dispensed quantity is verified using weight sensors and optical sensors to prevent under-dosing or overdosing.

* **Real-Time Monitoring & Cloud Integration:**
    * Syncs all medication dispensing logs in real-time with a secure cloud platform and Electronic Health Records (EHRs).
    * Provides a cloud-based dashboard for doctors and pharmacists to remotely monitor medication adherence.

* **Advanced Accessibility Features:**
    * **Voice-Prescription:** Allows users to dictate prescriptions verbally. The system uses Speech-to-Text and Natural Language Processing (NLP) to convert spoken words into digital text and extract key information. This is particularly useful for visually impaired, elderly, or low-literacy users.
    * **AI Drug Substitution Engine:** If a prescribed drug is out of stock, the system uses an AI model to suggest safe and effective generic or branded alternatives.

## ⚙️ How It Works (System Workflow)

The user interaction with the MEDIKIOSK follows a systematic process:

1.  **Activation & Authentication:** The system activates when a user approaches. The user authenticates their identity via biometrics or OTP. The system validates credentials against cloud-stored records.
2.  **Prescription Processing:** The user scans or uploads a prescription. The AI-based OCR interprets the prescription, cross-checking the data with a medical database for accuracy and authenticity.
3.  **Medication Dispensing:** Once validated, the system autonomously identifies the correct medication compartment. A robotic mechanism dispenses the precise dose into a collection tray. The user is notified via audio-visual alerts.
4.  **Collection & Confirmation:** The user retrieves the dispensed drug, which is detected by infrared sensors. The transaction (time, date, user identity) is recorded. If the medication is not collected, reminders are sent, and the items may be retracted for security.

## 🛠️ Proposed Technology Stack

To build this system, the following technologies are implied by the patent:

* **AI & Machine Learning:**
    * **OCR:** Tesseract, OpenCV
    * **ML/NLP:** TensorFlow, PyTorch, Scikit-learn, spaCy
* **Backend:** Python (Django, Flask), Node.js (Express)
* **Database:** PostgreSQL, MySQL, MongoDB
* **Cloud & DevOps:** AWS, Google Cloud, or Azure for hosting, IoT services, and EHR integration.
* **Frontend:**
    * **Kiosk UI:** A JavaScript framework like React or Vue.js with Electron.
    * **Web Dashboard:** React, Angular, or Vue.js.
* **Hardware Control:** Python or C++ for interfacing with robotics (robotic arm, sensors) and biometric scanners.

## 🚀 Setup and Installation

**(This is a conceptual project. The following are placeholder instructions.)**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/medikiosk.git](https://github.com/your-username/medikiosk.git)
    cd medikiosk
    ```
2.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Setup the database and run migrations.**
4.  **Start the server:**
    ```bash
    python manage.py runserver
    ```

## Usage

**(Placeholder instructions.)**

1.  Launch the kiosk application.
2.  Authenticate using the on-screen instructions (biometric or OTP).
3.  Place a prescription on the scanner or upload a digital file.
4.  Confirm the detected medication and dosage.
5.  Collect the dispensed medication from the tray.

## 🤝 Contributing

Contributions to this project are welcome! Please fork the repository, create a new branch for your feature, and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is based on a patent application and is intended for conceptual and educational purposes. All rights are reserved by the applicant.

## 🏢 Applicant Information

* **Name:** SRM TRP ENGINEERING COLLEGE
* **Nationality:** INDIAN
* **Address:** The Principal, SRM TRP ENGINEERING COLLEGE, SRM Nagar, Trichy - Chennai Highway, Near Samayapuram, Tiruchirappalli - 621105. Tamil Nadu

---
*This README is based on the patent specification filed on the 25th day of April, 2025.*

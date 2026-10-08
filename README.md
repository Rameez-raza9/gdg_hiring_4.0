# GDGoC SVEC 4.O Hiring

[![Live Site](https://img.shields.io/badge/Live%20Site-gdg--hiring--4--0.vercel.app-blue?style=for-the-badge&logo=vercel)](https://gdg-hiring-4-0.vercel.app/)
[![Created By](https://img.shields.io/badge/Developed%20By-Rameez--raza9-black?style=for-the-badge&logo=github)](https://github.com/Rameez-raza9)

Official recruitment portal for **Google Developer Groups On Campus (GDGoC) SVEC 4.0**.

🌐 **Live Application:** [https://gdg-hiring-4-0.vercel.app/](https://gdg-hiring-4-0.vercel.app/)

---

## 📌 Overview

The **GDGoC SVEC 4.0 Hiring Portal** is a web application built to streamline candidate applications across multiple technical and non-technical domains. It guides applicants through an intuitive multi-step form, validates entries in real-time, and integrates seamlessly with Google Sheets via a serverless Google Apps Script backend.

Developed and maintained by **[Rameez-raza9](https://github.com/Rameez-raza9)**.

---

## 🚀 Key Features

- **Multi-Step Application Flow:**
  1. Personal Details (Name, Email, Phone, Social Profiles)
  2. Academic Details (Year, Branch, Section, Roll Number)
  3. Domain & Wing Selection (Tech & Non-Tech tracks)
  4. Additional Questions & Experience Details
  5. Review & Final Submission
- **Domain Specializations:**
  - **Tech:** AI & ML, Web Development, Coding, Cloud & DevOps
  - **Non-Tech:** Public Relations (PR), Creative Design, Social Media Marketing, Event Management
- **Automated Backend Storage:** Submissions are written directly to private Google Sheets via a Google Apps Script web app endpoint with unique 10-digit application IDs.
- **Modern Responsive Design:** Fast, mobile-first design styled with Tailwind CSS and Lucide React icons.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
- **Backend / Storage:** Google Apps Script, Google Sheets API
- **Deployment:** Vercel

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rameez-raza9/gdg_hiring_4.0.git
   cd gdg_hiring_4.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env.local` and add your Google Apps Script URL:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author

Developed by **[Rameez-raza9](https://github.com/Rameez-raza9)**  
GitHub: [@Rameez-raza9](https://github.com/Rameez-raza9)

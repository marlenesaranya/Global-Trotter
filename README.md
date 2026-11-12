# 🌍 GlobeTrotter – AI-Powered Travel Planning Platform

**Plan smarter. Travel better. Explore more.**

GlobeTrotter is an AI-powered full-stack travel planning web application designed to simplify trip organization. It generates personalized, day-wise travel itineraries based on user preferences and provides an integrated platform for discovering destinations, managing budgets, and organizing travel experiences.

## ✨ Key Features

- **🤖 AI-Powered Itinerary Generation:** Generate personalized multi-day travel plans based on destination and trip duration.
- **🗺️ Interactive Maps:** Explore destinations with location-based map integration and images of places.
- **💬 AI Travel Chatbot:** Get instant assistance, travel suggestions, and answers to travel-related queries.
- **💰 Smart Budget Planner:** Organize and track estimated travel expenses.
- **🎒 Packing Checklist:** Manage essential travel items with an interactive checklist.
- **📓 Travel Journal:** Record travel memories, notes, and important trip details.
- **📱 Responsive Dashboard:** User-friendly interface with an organized, modern dark-themed design.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| AI Integration | Groq AI API |
| API Communication | REST APIs |
| Build Tool | Vite |
| Deployment | Vercel |

## 🏗️ Project Architecture

GlobeTrotter follows a full-stack architecture:

1. **Frontend Layer:** Collects user preferences and displays generated travel information through an interactive dashboard.
2. **Backend Layer:** Handles API requests, processes travel data, and communicates with AI services.
3. **AI Layer:** Uses Groq AI integration for intelligent travel assistance and itinerary generation.
4. **Visualization Layer:** Presents itineraries, maps, budget summaries, and travel information.

## 📂 Project Structure

```text
GlobeTrotter/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── components/
│   ├── services/
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

*Adjust the folder structure above if your final repository differs.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/marlenesaranya/Global-Trotter.git
```

```bash
cd Global-Trotter
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the Backend folder:

```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Never expose API keys or commit your `.env` file to GitHub.

### 4. Start the Backend

```bash
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

### 5. Start the Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🎯 Project Objective

To develop an intelligent travel planning platform that reduces manual planning effort by combining AI-powered recommendations, destination discovery, budgeting, and travel organization into one seamless application.

## 🚀 Future Enhancements

- Real-time flight and hotel booking integration.
- Live weather information and travel alerts.
- User authentication and cloud-based trip storage.
- Advanced personalized travel recommendations.
- Multi-currency budget conversion.

## 👩‍💻 Developer

**Marlene Saranya S**

Computer Science Engineering Student

---

⭐ If you find this project interesting, consider giving the repository a star!

**Built with curiosity, powered by AI, and driven by innovation.** 🌍

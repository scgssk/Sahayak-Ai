
# 🤖 Sahayak – AI Teaching Assistant

Sahayak is an AI-powered mobile teaching assistant built with **React Native + Express** , tailored for educators in low-resource classrooms.
It generates stories, worksheets, lesson plans, child-friendly explanations, and visual aids — all powered by the latest AI models.

---

![React Native](https://img.shields.io/badge/Mobile-React_Native-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Express-green?logo=node.js)
![AI-Powered](https://img.shields.io/badge/AI-Gemini_&_OpenRouter-purple)
![Expo](https://img.shields.io/badge/Platform-Expo-orange?logo=expo)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📲 Features

| Module               | Description                                                                |
|----------------------|----------------------------------------------------------------------------|
| 📖 Story Generator   | Creates fun, educational stories based on topic, grade, and language.       |
| 📝 Worksheet Creator | Builds worksheets using textbook page image + topic for 3 grade levels.     |
| 🤖 Knowledge Assistant | Explains questions in simple, child-friendly ways using analogies.         |
| 🧩 Visual Aid Tool    | Generates ASCII-style diagrams + step-by-step sketch instructions.          |
| 📅 Lesson Planner     | Crafts a 6-day weekly plan with topics, activities, and assessments.        |
| 📁 Offline Mode       | (Coming soon) Cache AI-generated content for use without internet.         |

---

## 🛠️ Tech Stack

- ⚛️ **React Native + Expo**
- 🌐 **Express + Node.js**
- 🔊 **Text-to-Speech via expo-speech**
- 🤖 **AI via Google Gemini API**
- 🖼️ **(Experimental) Image AI via Stability/OpenRouter**
- ⚙️ **Multer for file uploads**
- 🔒 **Secure server-only API key handling**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Sahayak-Ai.git
````

---

### 2. Setup Environment Variables

In the `sahayakapi/` directory, create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
STABILITY_API_KEY=your_image_ai_key
```

---

### 3. Start the Backend Server

```bash
cd sahayakapi
npm install
node index.js
```

Runs at: `http://localhost:5000`

---

### 4. Start the Frontend App (Expo)

```bash
in the root folder
npm install
npx expo start
```

Open on mobile using **Expo Go**, or run in an emulator.

---


## 🔐 Security & Ethics

* API keys are **never exposed** on frontend.
* All prompts are sanitized and crafted to avoid unsafe or harmful outputs.
* Offline-first design helps **teachers in areas with low connectivity**.

---

## 🙌 Contributing

Pull requests and suggestions are welcome!
Open an issue to discuss bugs, features, or improvements.

---

## 📄 License

MIT License © 2025 – S C G Sree Soorya Kumar

---

> *Empowering grassroots education through practical AI tools.*




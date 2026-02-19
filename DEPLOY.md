# Deployment Guide

This guide will walk you through deploying your **Stock Trading Web Application**.
Since the app uses **WebSockets (Socket.io)** for real-time data, we use a split deployment strategy:

1.  **Backend**: Deployed to **Render.com** (Supports WebSockets/Node.js).
2.  **Frontend**: Deployed to **Vercel** (Best for React/Vite).

---

## Part 1: Deploy Backend to Render

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Sign Up/Login**: Go to [Render.com](https://render.com/) and log in (use GitHub).
3.  **Create Service**:
    *   Click **"New"** -> **"Web Service"**.
    *   Connect your GitHub repository.
4.  **Configure Settings**:
    *   **Name**: `stock-trading-backend` (or similar).
    *   **Root Directory**: `backend` (Important!).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `node server.js`.
    *   **Plan**: Free.
5.  **Environment Variables**:
    *   Scroll down to "Environment Variables" and add these (copy from your `.env`):
        *   `MONGO_URI`: `mongodb+srv://TradeVerseAdmin:TradeVerse123@cluster0.a9jzgrg.mongodb.net/TradeVerse_db?appName=Cluster0`
        *   `JWT_SECRET`: `supersecretkey123`
        *   `GOOGLE_CLIENT_ID`: `578118654112-tq8hm4vqmmrkqnuhaebk6frlt24bcr6l.apps.googleusercontent.com`
6.  **Deploy**: Click **"Create Web Service"**.
    *   Wait for the deployment to finish.
    *   **Copy your Backend URL** (e.g., `https://stock-trading-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com/) and log in (use GitHub).
2.  **Create Project**:
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite (should detect automatically).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Click "Environment Variables" and add:
        *   `VITE_API_URL`: **[PASTE YOUR RENDER BACKEND URL HERE]** (e.g., `https://stock-trading-backend.onrender.com/api`)
          *   *Note: Ensure you add `/api` at the end if your backend expects it.*
        *   `VITE_GOOGLE_CLIENT_ID`: `578118654112-tq8hm4vqmmrkqnuhaebk6frlt24bcr6l.apps.googleusercontent.com`
        *   `VITE_ALPHA_VANTAGE_API_KEY`: `R6I6NZ7VPKBH7JI5`
5.  **Deploy**: Click **"Deploy"**.
6.  **Visit**: Vercel will give you a live URL (e.g., `https://stock-trading-app.vercel.app`).

---

## Part 3: Final Connection (Important!)

1.  **Update Google Cloud Console**:
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Select your project -> **APIs & Services** -> **Credentials**.
    *   Edit your **OAuth 2.0 Client ID**.
    *   **Authorized JavaScript Origins**: Add your **Vercel Frontend URL**.
    *   **Authorized Redirect URIs**: Add your **Vercel Frontend URL**.
    *   Save.

2.  **Test**: Open your deployed Vercel app. It should now work perfectly!

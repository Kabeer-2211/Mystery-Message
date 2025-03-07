# 🎉 **Mystery Message** 🎉

Welcome to the **Mystery Message**! This project leverages **Next.js**, **TypeScript**, and **NextAuth** for secure OTP authentication and provides an interactive messaging system with advanced features like message management and suggestion functionality.

---

## 🚀 **Features**

- 🔐 **Secure OTP Authentication**: Users can register and log in with a One-Time Password (OTP) sent to their email, powered by **NextAuth**.
  
- 🗨️ **Message System**: Each user has a **unique URL** that allows others to send them messages.

- 🔄 **Message Management**: Users can:
  - **Refresh** their message list.
  - **Delete** messages.
  
- 💬 **Message Status Toggle**: Users can toggle their message status to show whether they are accepting messages or not.

- 💡 **Message Suggestions**: Senders can pick from **suggested messages** and click on the **suggest** button to get ai suggested messages easily.

---

## ⚡ **Getting Started**

To get started with this project locally, follow the instructions below:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nextjs-otp-auth-messaging.git
cd nextjs-otp-auth-messaging
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Set Up Environment Variables

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_PROVIDER_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXTAUTH_PROVIDER_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OTP_SECRET=your_otp_secret_here
```
### 4. Run The Application

```bash
npm run dev
```

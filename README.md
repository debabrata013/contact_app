
````markdown
# 📇 Contact Manager App

A modern contact manager built with **Next.js**, **Clerk Authentication**, and **MongoDB**. Logged-in users can securely manage their own contacts with options to add, edit, delete, call, WhatsApp, or email them.

## ✨ Features

- 🔐 User authentication with **Clerk**
- 📥 Add new contacts (Name, Phone, Email)
- 📄 View all contacts (only for logged-in user)
- 🔍 Search contacts by name/email/phone
- ✏️ Edit contact details
- 🗑️ Delete contacts (with confirmation)
- 📞 One-click Call, WhatsApp, and Email
- 💾 Data stored securely in **MongoDB**

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| Next.js    | React framework for frontend & API routes |
| Clerk      | Authentication (SignUp / SignIn / User ID) |
| MongoDB    | NoSQL database to store contact data       |
| TailwindCSS| Utility-first styling                      |

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/debabrat013/contact_appp.git
cd contact_appp
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root and add:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the App

```bash
npm run dev
```

App will be live at: `http://localhost:3000`

---

## 🧠 Project Structure

```
app/
├── api/
│   └── contacts/         # API route handlers (POST, GET, PUT, DELETE)
├── page.tsx              # Home page after login
components/
├── ContactCard.tsx       # Contact UI with Call, WhatsApp, Email
├── AddContactForm.tsx    # Form to add new contact
utils/
├── db.ts                 # MongoDB connection utility
models/
├── Contact.ts            # Mongoose schema for contact
```

---

## 🔒 Authentication Flow

* Uses **Clerk** for user login/signup.
* Each contact is tied to the `userId` provided by Clerk.
* API endpoints are protected to handle only that user's data.

---

## 📱 UI Preview

(Include a screenshot or short gif here)

---

## 🚀 Deployment (Optional)

Can be deployed on **Vercel** with:

* MongoDB Atlas for database
* Clerk credentials set in Vercel environment variables

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📃 License

MIT © 2025 Debabrata Pattnayak


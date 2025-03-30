# Notification System

A real-time notification system using **Node.js**, **Express.js**, **Socket.IO**, and **PostgreSQL**. This project enables sending, receiving, and managing notifications with read/unread status, pagination, and real-time updates.

## 🚀 Features
- Real-time notifications using **Socket.IO**
- Mark individual/all notifications as read
- Delete all read notifications
- User selection for sending notifications
- Pagination support

---
## 📜 Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---
## ⚡ Installation
```sh
# Clone the repository
git clone https://github.com/your-repo/notification-system.git
cd notification-system

# Install dependencies
npm install

# Start the server
npm run dev  # For development mode
npm start    # For production mode
```

---
## 🌍 Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_NAME=Your_DB_Name
DB_USER=Your_DB_User
DB_PASSWORD=Your_DB_Password
DB_HOST=Your_DB_Host

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

```

---
## 🔗 API Endpoints

### 🔹 Notifications
#### 1️⃣ Get All Notifications
```http
GET /notifications?userId={userId}
```
**Response:**
```json
[
  { "id": "1", "message": "New update available!", "isRead": false, "createdAt": "2025-03-30T12:00:00Z" }
]
```

#### 2️⃣ Mark a Notification as Read
```http
PUT /notifications/{notificationId}/read
```

#### 3️⃣ Mark All Notifications as Read
```http
PUT /notifications/mark-all-read
```

#### 4️⃣ Delete All Read Notifications
```http
DELETE /notifications/delete-all-read
```

#### 5️⃣ Send a Notification
```http
POST /notifications/send
```
**Body:**
```json
{ "receiverId": "user123", "message": "You have a new message!" }
```

---
## 🛠️ Usage
1. Start the server: `npm run dev`
2. Open the frontend in the browser.
3. Send a notification from the dashboard.
4. Check real-time updates in the notification panel.

---
## 📁 Project Structure
```
notification-system/
│── app.js          # Main server file
│── routes/         # API routes
│── config/         # Database and Socket configuration
│── controllers/    # Business logic for notifications
│── middlewares/    # Authentication middleware
│── models/         # PostgreSQL models
│── public/         # Frontend assets
│── views/          # Frontend templates
│── .env.example    # Sample environment variables
│── README.md       # Documentation
```

---
## 🤝 Contributing
1. Fork the repository.
2. Create a new feature branch.
3. Commit changes with clear messages.
4. Push to GitHub and open a Pull Request.

---
## 📜 License
This project is licensed under the **MIT License**. Feel free to use and modify it! 🚀


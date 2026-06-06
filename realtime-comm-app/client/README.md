# CommApp — Real-Time Communication App 📡

A full-stack video conferencing and collaboration tool built with WebRTC, Socket.io, React, and Node.js.

---

## 🚀 Features

| Feature                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| 🔐 User Authentication | Register & Login with JWT tokens and bcrypt password hashing |
| 🏠 Room Management     | Create, search, and join collaboration rooms                 |
| 🎥 Video Calling       | Multi-user real-time video calling using WebRTC              |
| 🖥️ Screen Sharing      | Share your screen with all room participants                 |
| 📁 File Sharing        | Share files up to 10MB with everyone in the room             |
| 🎨 Whiteboard          | Real-time collaborative drawing board                        |
| 💬 Encrypted Chat      | End-to-end AES encrypted in-room chat                        |
| 🔗 Room Invite Link    | Copy and share room link with anyone                         |
| 🍃 MongoDB             | Persistent user data storage                                 |
| 🔔 Toast Notifications | Real-time success/error notifications                        |

---

## 🛠️ Tech Stack

### Frontend

- **React.js** — UI framework
- **React Router DOM** — Client-side routing
- **Socket.io Client** — Real-time communication
- **Simple Peer** — WebRTC wrapper
- **Axios** — HTTP requests
- **Crypto-JS** — AES encryption
- **Lucide React** — Icons

### Backend

- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **Socket.io** — WebSocket server
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication tokens
- **Bcryptjs** — Password hashing

---

## 📁 Project Structure

```
realtime-comm-app/
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── axios.js        # Axios instance
│       │   └── socket.js       # Socket.io client
│       ├── components/
│       │   ├── Chat.jsx        # Encrypted chat panel
│       │   ├── CreateRoomModal.jsx
│       │   ├── FileShare.jsx   # File sharing panel
│       │   ├── Loader.jsx      # Loading spinner
│       │   ├── Navbar.jsx
│       │   ├── RoomCard.jsx
│       │   ├── Toast.jsx       # Notifications
│       │   ├── VideoTile.jsx   # Video feed tile
│       │   └── Whiteboard.jsx  # Drawing board
│       ├── context/
│       │   ├── AuthContext.js  # Auth state
│       │   ├── RoomContext.js  # Room state
│       │   └── ToastContext.js # Toast state
│       ├── hooks/
│       │   ├── useChat.js      # Chat logic
│       │   ├── useFileShare.js # File sharing logic
│       │   ├── useWebRTC.js    # WebRTC logic
│       │   └── useWhiteboard.js
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── NotFound.jsx
│       │   ├── Register.jsx
│       │   └── Room.jsx
│       └── utils/
│           └── encryption.js   # AES encrypt/decrypt
│
└── server/                     # Node.js Backend
    ├── controllers/
    │   └── authController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── authRoutes.js
    ├── .env
    └── index.js
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js v16+
- MongoDB (local )
- Modern browser with camera/microphone

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-comm-app.git
cd realtime-comm-app
```

### Step 2 — Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `/server`:

```env
PORT=5000
JWT_SECRET=your_super_secret_key
MONGO_URI=mongodb://localhost:27017/commapp
```

Start the server:

```bash
npm run dev
```

### Step 3 — Frontend Setup

```bash
cd client
npm install
npm start
```

### Step 4 — Open the App

```
http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable     | Description               | Example                             |
| ------------ | ------------------------- | ----------------------------------- |
| `PORT`       | Server port               | `5000`                              |
| `JWT_SECRET` | Secret key for JWT tokens | `mysecretkey123`                    |
| `MONGO_URI`  | MongoDB connection string | `mongodb://localhost:27017/commapp` |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register new user            |
| POST   | `/api/auth/login`    | Login user                   |
| GET    | `/api/auth/me`       | Get current user (protected) |

### Request Body — Register

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

### Request Body — Login

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Response — Success

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "username": "john",
    "email": "john@example.com"
  }
}
```

---

## 🔌 Socket.io Events

### Client → Server

| Event                  | Payload                                                      | Description            |
| ---------------------- | ------------------------------------------------------------ | ---------------------- |
| `join-room`            | `{ roomId, username }`                                       | Join a room            |
| `leave-room`           | `{ roomId }`                                                 | Leave a room           |
| `offer`                | `{ to, offer, from, username }`                              | WebRTC offer           |
| `answer`               | `{ to, answer, from }`                                       | WebRTC answer          |
| `ice-candidate`        | `{ to, candidate, from }`                                    | ICE candidate          |
| `screen-share-started` | `{ roomId }`                                                 | Start screen share     |
| `screen-share-stopped` | `{ roomId }`                                                 | Stop screen share      |
| `file-share`           | `{ roomId, fileData, fileName, fileType, fileSize, sender }` | Share a file           |
| `send-message`         | `{ roomId, encryptedMsg, sender, timestamp }`                | Send encrypted message |
| `draw`                 | `{ roomId, drawData }`                                       | Whiteboard draw        |
| `whiteboard-clear`     | `{ roomId }`                                                 | Clear whiteboard       |
| `whiteboard-undo`      | `{ roomId }`                                                 | Undo whiteboard        |

### Server → Client

| Event                  | Payload                                                         | Description             |
| ---------------------- | --------------------------------------------------------------- | ----------------------- |
| `room-users`           | `[{ socketId, username }]`                                      | Users already in room   |
| `user-joined`          | `{ socketId, username, roomId }`                                | New user joined         |
| `user-left`            | `{ socketId, roomId }`                                          | User left               |
| `offer`                | `{ from, offer, username }`                                     | Incoming WebRTC offer   |
| `answer`               | `{ from, answer }`                                              | Incoming WebRTC answer  |
| `ice-candidate`        | `{ from, candidate }`                                           | Incoming ICE candidate  |
| `screen-share-started` | `{ socketId }`                                                  | Someone started sharing |
| `screen-share-stopped` | `{ socketId }`                                                  | Someone stopped sharing |
| `file-received`        | `{ fileData, fileName, fileType, fileSize, sender, timestamp }` | Incoming file           |
| `message-received`     | `{ encryptedMsg, sender, timestamp }`                           | Incoming message        |
| `draw`                 | `{ drawData }`                                                  | Incoming draw data      |
| `whiteboard-clear`     | —                                                               | Clear whiteboard        |
| `whiteboard-undo`      | —                                                               | Undo whiteboard         |

---

## 🔒 Security

- **JWT Authentication** — All protected routes require Bearer token
- **Password Hashing** — bcryptjs with salt rounds of 10
- **AES Encryption** — Chat messages encrypted before sending using CryptoJS
- **E2E Encryption** — Server never decrypts messages, only forwards encrypted data
- **Room-based Keys** — Each room has unique encryption key derived from Room ID

---

## 🧪 Testing the App

### Two Users on Same PC

**User 1 — Normal Browser:**

1. Go to `http://localhost:3000`
2. Register/Login
3. Create a room
4. Click **"Share Room"** to copy invite link

**User 2 — Incognito Window (Ctrl+Shift+N):**

1. Paste the copied link
2. Register a new account
3. Automatically joins the room

---

## 🎯 How to Use

### Creating a Room

1. Login to your account
2. Click **"Create Room"** on dashboard
3. Enter room name
4. Toggle **Private/Public**
5. Click **Create**

### Joining a Room

1. Click **"Join Room"** on any room card
2. Or open a shared invite link
3. Allow camera & microphone permissions

### Sharing Your Screen

1. Inside a room, click **"Share Screen"**
2. Select screen or window to share
3. Click **"Stop Share"** to stop

### Using the Whiteboard

1. Click **"Whiteboard"** button
2. Choose pen/eraser tool
3. Select color and brush size
4. Draw — all participants see it in real-time

### Sharing Files

1. Click **"Files"** button
2. Click **"Share File"**
3. Select any file under 10MB
4. All participants can download it

### Encrypted Chat

1. Click **"Chat"** button
2. Type your message
3. Press **Enter** to send
4. Messages are AES encrypted before sending

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

Built as part of **CodeAlpha Full Stack Development Internship**

---

## 🙏 Acknowledgements

- [WebRTC](https://webrtc.org/) — Real-time communication
- [Socket.io](https://socket.io/) — WebSocket library
- [Simple Peer](https://github.com/feross/simple-peer) — WebRTC wrapper
- [MongoDB](https://www.mongodb.com/) — Database
- [Lucide Icons](https://lucide.dev/) — Icon library

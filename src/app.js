const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { sequelize } = require('./models'); // ✅ Import centralized models
const app = express();
const server = http.createServer(app);
// const setupSocket = require('./config/socket');
const socketIo = require('socket.io');
const io = socketIo(server, { cors: { origin: "*" } });
const { initializeSocket } = require("./config/socket");
initializeSocket(server);

sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Database connection failed:", err));
// Database setup
// initializeDatabase();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRoutes);
app.use('/notifications', notificationRoutes);

// Dashboard route
app.get('/dashboard', require('./middleware/authMiddleware'), (req, res) => {
  res.render('dashboard', { 
    username: req.user.username, 
    userId: req.user.userId 
  });
});

// Socket.io setup
// require('./config/socket')(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
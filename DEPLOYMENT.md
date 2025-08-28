# Deployment Instructions

## Socket Server on Render

### 1. Create a new repository for the socket server
Create a new GitHub repository (e.g., `flick-socket-server`) with these files:
- `socket-server.js` (rename from socket-server.ts and convert to JS)
- `package.json` (use the one created: socket-server-package.json)

### 2. Convert socket-server.ts to socket-server.js
Since Render works better with plain JavaScript, convert the TypeScript file:

```javascript
const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")

const app = express();
const server = http.createServer(app);

// Configure CORS for both development and production
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.FRONTEND_URL // Add this env var on Render
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

// ... rest of your socket code ...

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`)
})

module.exports = {io, onlineUsers}
```

### 3. Deploy on Render
1. Go to render.com and create a new Web Service
2. Connect your socket server repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variable: `FRONTEND_URL` = your Vercel app URL

### 4. Update CORS origins
After deploying, update the `allowedOrigins` array with your actual URLs:
- Replace "https://your-vercel-app.vercel.app" with your Vercel domain
- The Render URL will be something like: https://your-app-name.onrender.com

## Next.js App on Vercel

### 1. Deploy to Vercel
1. Push your Next.js code to GitHub
2. Import the project on Vercel
3. Add environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_SOCKET_URL` = your Render socket server URL

### 2. Environment Variables
Set these in Vercel:
- `NEXT_PUBLIC_SOCKET_URL` = https://your-render-app.onrender.com
- `MONGO_URI` = your MongoDB connection string
- Any other environment variables your app needs

### 3. Update socket server CORS
After getting your Vercel URL, update the socket server's `allowedOrigins` array to include your Vercel domain.

## Testing
1. Deploy both services
2. Test socket connections between Vercel frontend and Render backend
3. Monitor logs on both platforms for any CORS or connection issues

# 🎬 Flick - The Ultimate Movie Social Media Platform

<div align="center">

<!--![Flick Logo](public/bg-image.jpg)-->

**Connect. Share. Discover. Experience Movies Together.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-yellow)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

[Website URL](http://flick-five.vercel.app/)

</div>

---

## 🌟 What is Flick?

Flick is a revolutionary social media platform designed specifically for movie enthusiasts. It combines the social aspects of traditional platforms with rich movie discovery features, creating the ultimate destination for film lovers to connect, share, and explore cinema together.

## ✨ Key Features

### 🎭 Social Experience
- **Real-time Social Feed** - Share thoughts, reviews, and movie moments instantly
- **Interactive Posts** - Like, comment, share, and bookmark content with live updates
- **Follow System** - Build your movie community by following fellow film enthusiasts
- **Live Notifications** - Get instant updates on interactions and new content
- **Personal Profiles** - Showcase your movie journey and social activity

### 🎥 Movie Discovery
- **Comprehensive Movie Database** - Powered by TMDB API with extensive film information
- **Smart Search** - Find movies, users, and content effortlessly
- **Genre Exploration** - Discover films by mood, genre, and preferences
- **Trending Movies** - Stay updated with what's popular and trending
- **Personal Watchlist** - Save movies for later viewing
- **Movie Reviews** - Read and write detailed movie reviews with rating system

### 🔥 Real-time Features
- **Live Interactions** - Real-time likes, comments, and follows
- **Instant Notifications** - Get notified immediately when someone engages with your content
- **Live User Activity** - See who's online and active in your network
- **Real-time Review Updates** - Watch movie discussions unfold in real-time

### 📱 Modern Experience
- **Responsive Design** - Perfect experience across all devices
- **Dark/Light Themes** - Choose your preferred viewing experience
- **Smooth Animations** - Engaging transitions and micro-interactions
- **Fast Loading** - Optimized performance with Next.js 15
- **Image Optimization** - Cloudinary-powered media management

### 🔐 Authentication & Security
- **Multiple Auth Options** - Sign in with Google or create an account
- **Secure Sessions** - NextAuth.js powered authentication
- **Profile Management** - Update your profile, image, and preferences
- **Privacy Controls** - Control your content visibility and interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.3** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Spring** - Advanced animations
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless backend functions
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **NextAuth.js** - Authentication solution
- **Socket.io** - Real-time communication
- **Express.js** - Socket server framework

### External Services
- **TMDB API** - Movie database and information
- **Cloudinary** - Image and media management
- **News API** - Latest entertainment news

### Deployment
- **Vercel** - Frontend hosting and deployment
- **Render** - Socket server hosting
- **MongoDB Atlas** - Database hosting

<!--
## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- TMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshGeed/Flick.git
   cd Flick
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your API keys and database URLs
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the socket server** (in another terminal)
   ```bash
   cd socket-server
   npm install
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

Create `.env.local` with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# APIs
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_TOKEN=your_tmdb_api_token
NEWS_API_KEY=your_news_api_key

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_PROJECT_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Socket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
-->

## 📁 Project Structure

```
flick/
├── app/                    # Next.js app directory
│   ├── (backend)/api/     # API routes
│   ├── (frontend)/        # Frontend pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utility libraries
├── models/                # Database models
├── socket-server/         # Real-time server
├── public/                # Static assets
└── utils/                 # Helper functions
```
<!--
## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Socket Server (Render)
1. Create a new Web Service on Render
2. Connect the `socket-server` directory
3. Set environment variables
4. Deploy and get your socket server URL

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 👨‍💻 Author

**Harsh Geed**
- GitHub: [@HarshGeed](https://github.com/HarshGeed)
- LinkedIn: [Connect with me](https://linkedin.com/in/harshgeed)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the comprehensive movie database
- [Vercel](https://vercel.com/) for seamless deployment
- [MongoDB](https://mongodb.com/) for reliable database hosting
- All the amazing open-source libraries that made this project possible

---

<div align="center">

**Made with ❤️ for movie lovers everywhere**

[⭐ Star this repo](https://github.com/HarshGeed/Flick) • [🐛 Report Bug](https://github.com/HarshGeed/Flick/issues) • [💡 Request Feature](https://github.com/HarshGeed/Flick/issues)

</div>

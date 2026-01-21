# 🌌 Cosmic Gallery

A stunning Pinterest-inspired image gallery application with a cosmic space theme. Built with Node.js, Express, and MongoDB, this platform allows users to create, share, and organize visual content in a beautiful, immersive interface.

## ✨ Features

### 🎨 Core Functionality
- **Image Upload & Management**: Upload and showcase your visual content with support for various image formats
- **User Authentication**: Secure registration, login, and session management with bcrypt password hashing
- **Post Creation**: Create posts with titles, captions, images, and tags
- **Social Interaction**: Like and comment on posts from other users
- **Search & Discovery**: Search posts by title, caption, or tags with advanced filtering
- **Tag System**: Organize content with searchable tags and discover popular trends

### 👤 User Features
- **Profile Management**: Customizable user profiles with bio and profile images
- **Collections**: Create and organize posts into personal collections
- **Privacy Controls**: Set collections as public or private
- **Settings**: Manage account preferences and profile information

### 🎯 User Experience
- **Responsive Design**: Fully responsive interface that works on all devices
- **Cosmic Theme**: Beautiful space-themed design with animated star backgrounds
- **Glass Morphism**: Modern UI with glass-like effects and smooth animations
- **Real-time Updates**: Dynamic content loading and updates

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **EJS**: Embedded JavaScript templating engine
- **Multer**: Middleware for handling file uploads
- **Bcrypt**: Password hashing for security
- **Express Session**: Session management
- **Connect Flash**: Flash messaging system

### Frontend
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Custom CSS**: Space-themed styling with glass morphism effects

### File Structure
```
cosmic-gallery/
├── app.js                 # Main application file
├── bin/
│   └── www               # Server startup script
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── User.js           # User schema and model
│   ├── Post.js           # Post schema and model
│   ├── Collection.js     # Collection schema and model
│   ├── Comment.js        # Comment schema and model
│   └── Like.js           # Like schema and model
├── routes/
│   ├── index.js          # Home page and search routes
│   └── users.js          # User-related routes
├── views/
│   ├── partials/         # Reusable view components
│   ├── index.ejs         # Home page
│   ├── login.ejs         # Login page
│   ├── signup.ejs        # Registration page
│   ├── profile.ejs       # User profile page
│   ├── create-post.ejs   # Post creation page
│   ├── edit-post.ejs     # Post editing page
│   ├── post-details.ejs  # Individual post view
│   ├── collections.ejs   # Collections page
│   ├── collection-details.ejs # Collection details
│   ├── search.ejs        # Search results page
│   ├── settings.ejs      # User settings page
│   └── error.ejs         # Error page
├── public/
│   ├── css/              # Custom stylesheets
│   ├── uploads/          # User uploaded content
│   │   ├── profiles/     # Profile images
│   │   └── posts/        # Post images
│   └── stylesheets/      # Additional styles
├── package.json          # Dependencies and scripts
└── package-lock.json     # Dependency lock file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cosmic-gallery-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a MongoDB database
   - Set up your MongoDB connection URI
   - For production: Store your MongoDB URI in `/etc/secrets/MONGODB_URI`
   - For development: Modify the connection in `app.js`

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

### Database Configuration
The application connects to MongoDB using the connection URI specified in `/etc/secrets/MONGODB_URI`. For local development, you can modify the connection logic in `app.js`.

### File Upload Limits
- **Profile Images**: 5MB maximum size
- **Post Images**: 10MB maximum size
- **Supported Formats**: All image formats (validated by MIME type)

### Session Configuration
- Sessions are stored in memory (for development)
- Session secret: 'secret' (change for production)
- Session timeout: Browser session

## 📚 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /signup` - Registration page
- `POST /signup` - Create new user
- `GET /logout` - Logout user

### Posts
- `GET /` - Home page with posts feed
- `GET /post/create` - Create new post page
- `POST /post/create` - Submit new post
- `GET /post/:id/edit` - Edit post page
- `POST /post/:id/edit` - Update post
- `POST /post/:id/delete` - Delete post
- `GET /post/:id` - View post details
- `POST /post/:id/like` - Like/unlike post
- `POST /post/:id/comment` - Add comment to post

### User Profile
- `GET /profile/:id` - View user profile
- `GET /profile/:id/edit` - Edit profile page
- `POST /profile/:id/edit` - Update profile
- `GET /settings` - User settings page

### Collections
- `GET /collections` - View all collections
- `GET /collection/:id` - View collection details
- `POST /collection/create` - Create new collection
- `POST /collection/:id/add-post` - Add post to collection

### Search
- `GET /search` - Search page
- `GET /?q=query` - Search posts with query
- `GET /?tag=tagname` - Filter posts by tag

## 🎨 Design System

### Color Palette
- **Primary**: Deep space blues and purples
- **Background**: Gradient from dark blue to purple
- **Glass Effect**: Semi-transparent overlays with blur
- **Text**: Light colors for contrast against dark theme

### UI Components
- **Navigation**: Sticky glass-morphism header
- **Cards**: Glass-effect post cards with hover animations
- **Buttons**: Smooth transitions and hover states
- **Forms**: Clean, modern input fields with validation
- **Modals**: Overlay dialogs for interactions

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Session Management**: Secure session handling
- **File Upload Validation**: MIME type checking and size limits
- **Input Sanitization**: Protection against XSS attacks
- **Authentication Middleware**: Protected routes for logged-in users

## 🚀 Deployment

### Environment Variables
For production deployment, ensure the following:
- MongoDB connection URI is securely stored
- Session secret is changed from default
- File upload directories have proper permissions
- Error handling is configured for production

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, or AWS
- **Database**: MongoDB Atlas for cloud hosting
- **Static Files**: CDN for uploaded content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Inspired by Pinterest's grid layout and user experience
- Built with modern web technologies and best practices
- Cosmic theme designed for an immersive visual experience

---

**Created with ❤️ and a touch of cosmic magic** ✨🌌

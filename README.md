# 🌌 StarNet

A cosmic social media platform built with Node.js and Express, where users can share and discover stellar content about space, astronomy, and the universe.

![StarNet](https://img.shields.io/badge/StarNet-v1.0.0-purple?style=for-the-badge&logo=express)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure signup, login, and logout with Passport.js
- **Post Management** - Create, read, update, and delete posts
- **Social Interactions** - Like posts, add comments, and follow/unfollow users
- **Search & Discovery** - Explore posts by title, content, or tags
- **User Profiles** - Customizable profiles with bios and profile pictures
- **Real-time Feed** - Chronological and popularity-based post sorting

### Advanced Features
- **Tag System** - Organize content with searchable tags
- **Image Support** - Embed cosmic images in posts
- **Flash Messaging** - User-friendly notifications
- **Responsive Design** - Mobile-first cosmic UI with Tailwind CSS
- **Session Management** - Secure user sessions with cookies

## 🛸 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - Object Data Modeling (ODM)
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-flash** - Flash messages

### Frontend
- **EJS** - Embedded JavaScript templating
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap 5** - UI components
- **Google Fonts** (Orbitron, Inter) - Typography

### Development Tools
- **Morgan** - HTTP request logger
- **method-override** - HTTP method override
- **cookie-parser** - Cookie parsing

## 🌠 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/StarNet.git
   cd StarNet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a MongoDB secret file at `/etc/secrets/MONGODB_URI` (for production) or modify the connection in `app.js`:
   ```javascript
   const mongoURI = 'mongodb+srv://your-username:your-password@cluster.mongodb.net/starnet';
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started
1. **Sign up** for a new account or **log in** if you already have one
2. **Complete your profile** with a bio and profile picture
3. **Create your first post** sharing cosmic content
4. **Explore** other users' posts and engage with the community

### Key Actions
- **Create Posts**: Share space-related content with images and tags
- **Interact**: Like posts and leave cosmic echoes (comments)
- **Connect**: Follow other commanders and build your network
- **Discover**: Search for specific topics or browse popular content
- **Profile Management**: Update your bio and profile information

## 📁 Project Structure

```
StarNet/
├── bin/
│   └── www                 # Server startup script
├── middleware/
│   └── index.js           # Custom middleware functions
├── models/
│   ├── User.js            # User schema and model
│   └── Post.js            # Post schema and model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── index.js           # Home page routes
│   ├── posts.js           # Post CRUD routes
│   └── users.js           # User-related routes
├── views/
│   ├── partials/          # Reusable view components
│   ├── posts/             # Post-specific views
│   └── *.ejs              # Main view templates
├── public/
│   ├── images/            # Static images
│   └── stylesheets/       # CSS files
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Design System

### Color Palette
- **Galaxy** (#0a0a1a) - Deep space background
- **Nebula** (#8b5cf6) - Primary purple accent
- **Star Yellow** (#fbbf24) - Highlight and calls-to-action
- **Star Text** (#e2e8f0) - Primary text color
- **Cosmic Pink** (#ec4899) - Secondary accent
- **Deep** (#1e1b4b) - Card backgrounds

### Typography
- **Orbitron** - Space-themed display font
- **Inter** - Clean, readable body text

## 🔐 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **Session Security** - HTTP-only cookies with expiration
- **Authentication Middleware** - Route protection
- **Input Validation** - Server-side validation for all forms
- **CSRF Protection** - Built-in Express security
- **Authorization Checks** - User permissions for post operations

## 🌟 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /signup` - Registration page
- `POST /signup` - Create new user
- `GET /logout` - Logout user

### Posts
- `GET /posts` - Display all posts
- `GET /posts/new` - New post form
- `POST /posts` - Create new post
- `GET /posts/:id` - View single post
- `GET /posts/:id/edit` - Edit post form
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like/unlike post
- `POST /posts/:id/comments` - Add comment
- `DELETE /posts/:id/comments/:commentId` - Delete comment

### Users
- `GET /profile/:id` - View user profile
- `PUT /profile/:id` - Update user profile
- `POST /follow/:id` - Follow/unfollow user

### Discovery
- `GET /explore` - Explore posts with search and sorting

## 🚀 Deployment

### Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string

### Production Considerations
- Use MongoDB Atlas for production database
- Set up proper environment variable management
- Configure reverse proxy (nginx/Apache)
- Enable HTTPS with SSL certificates
- Set up process monitoring (PM2, forever)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/CosmicFeature`)
3. Commit your changes (`git commit -am 'Add new cosmic feature'`)
4. Push to the branch (`git push origin feature/CosmicFeature`)
5. Create a Pull Request

## 🙏 Acknowledgments

- **Express.js** - For the robust web framework
- **MongoDB** - For the powerful database solution
- **Tailwind CSS** - For the amazing utility-first CSS framework
- **Passport.js** - For the authentication solution
- **Space Community** - For inspiring the cosmic theme

## 📞 Support

If you encounter any issues or have questions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ and cosmic energy by the StarNet team**

*"Ad astra per aspera" - Through hardships to the stars* 🌟

# PChat - Real-time Chat Application

A modern, responsive real-time chat application built with React and Firebase. PChat provides seamless authentication and instant messaging capabilities with a clean, professional interface.

![PChat Demo](https://react-firebase-chat-ymcl.vercel.app/)

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Firebase Realtime Database
- **User Authentication**: Secure login and signup with Firebase Auth
- **Responsive Design**: Beautiful, mobile-first design using Tailwind CSS
- **Modern React**: Built with React 19.2.0 and modern hooks
- **Protected Routes**: Route-based authentication guards
- **Professional UI**: Clean, intuitive interface with loading states

## 🛠️ Technology Stack

- **Frontend**: React 19.2.0, React Router 7.9.4
- **Styling**: Tailwind CSS 3.4.18
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/react-firebase-chat.git
cd react-firebase-chat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Realtime Database
4. Copy your Firebase configuration

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## 📱 Usage

1. **Sign Up**: Create a new account with email and password
2. **Log In**: Use your credentials to access the chat
3. **Chat**: Start messaging in real-time with other users
4. **Security**: The app includes route protection and authentication guards

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chatcomp/       # Chat-specific components
│   ├── login/          # Login form component
│   ├── signup/         # Signup form component
│   └── UserHeader/     # User header component
├── pages/              # Page components
│   └── chat/           # Main chat page
├── utils/              # Utility functions
├── App.js              # Main app component with routing
├── firebase.js         # Firebase configuration
└── index.js            # App entry point
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Firebase](https://firebase.google.com/) - Google's mobile platform for app development
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Create React App](https://create-react-app.dev/) - React application bootstrapping tool

## 📞 Support

For support, email support@example.com or create an issue in this repository.

---

**Made with ❤️ using React and Firebase**

# Couples App - Full Stack Mobile Application

A production-ready mobile application for couples to track relationship time, share synced background photos, and send instant notifications.

## 🏗️ Architecture

- **Backend**: Spring Boot (Java 17+) with PostgreSQL
- **Frontend**: React Native with TypeScript
- **Deployment**: Docker & Docker Compose for self-hosted Ubuntu server

## 📁 Project Structure

```
.
├── backend/              # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
├── mobile/               # React Native frontend
│   ├── src/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   └── package.json
├── database/            # Database schema
│   └── schema.sql
├── docker-compose.yml    # Docker Compose configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for mobile app development)
- PostgreSQL (if running database separately)

### Backend Setup

1. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start Services with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Spring Boot backend on port 8080

3. **Initialize Database**

   ```bash
   docker exec -i couples_db psql -U postgres -d couples_db < database/schema.sql
   ```

### Mobile App Setup

1. **Install Dependencies**

   ```bash
   cd mobile
   npm install
   ```

2. **Configure API Endpoint**

   Edit `mobile/src/services/api.ts` and update `API_BASE_URL`:

   ```typescript
   const API_BASE_URL = 'http://your-server-ip:8080/api';
   ```

3. **Run on iOS**

   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

4. **Run on Android**

   ```bash
   npm run android
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Pairing

- `POST /api/pair/code` - Generate pairing code
- `POST /api/pair/confirm` - Confirm pairing with code

### Couple

- `GET /api/couple/status` - Get couple status
- `GET /api/couple/timer` - Get relationship timer data

### Slideshow

- `POST /api/slideshow/upload` - Upload image
- `GET /api/slideshow` - Get all images
- `PUT /api/slideshow/reorder` - Reorder images
- `DELETE /api/slideshow/{id}` - Delete image

### Quick Messages

- `POST /api/quick-messages` - Create custom message
- `GET /api/quick-messages` - Get all messages
- `DELETE /api/quick-messages/{id}` - Delete message
- `POST /api/notify/quick` - Send quick notification
- `POST /api/notify/custom` - Send custom notification

## 🔐 Security

- Passwords are hashed using BCrypt
- JWT tokens for authentication
- Refresh token support
- One active session per user
- Secure file upload validation

## 🗄️ Database Schema

See `database/schema.sql` for complete schema definition.

### Key Tables

- **users**: User accounts
- **couples**: Paired relationships
- **pairing_codes**: Temporary pairing codes
- **slideshow_images**: Shared background images
- **quick_messages**: Custom quick messages

## 📱 Features

### Authentication
- User registration with username, password, display name, and date of birth
- Secure login with JWT tokens
- Session management

### Pairing System
- Generate 6-digit pairing codes
- Codes expire after 5 minutes
- Single-use codes
- One partner per user

### Relationship Timer
- Real-time counter (days, hours, minutes, seconds)
- Syncs with backend timestamp
- Handles app background/resume
- Timezone-aware

### Synced Background Slideshow
- Upload photos from gallery
- Automatic slideshow with cross-fade
- Reorder images
- Delete images
- Changes sync to partner's device
- Local caching for offline use

### Quick Messages
- Predefined messages (❤️ I miss you, 😊 Thinking about you, ☕ Call me)
- Create custom messages (max 10, 50 chars each)
- One-tap instant notifications
- No chat history (stateless)

## 🐳 Docker Deployment

### Production Deployment on Ubuntu

1. **Clone and Setup**

   ```bash
   git clone <repository>
   cd Dating
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start Services**

   ```bash
   docker-compose up -d
   ```

3. **Initialize Database**

   ```bash
   docker exec -i couples_db psql -U postgres -d couples_db < database/schema.sql
   ```

4. **View Logs**

   ```bash
   docker-compose logs -f backend
   ```

5. **Stop Services**

   ```bash
   docker-compose down
   ```

### Environment Variables

Required environment variables (set in `.env`):

- `DATABASE_NAME`: PostgreSQL database name
- `DATABASE_USERNAME`: PostgreSQL username
- `DATABASE_PASSWORD`: PostgreSQL password
- `JWT_SECRET`: Secret key for JWT (min 256 bits)
- `SERVER_PORT`: Backend server port (default: 8080)
- `UPLOAD_DIR`: Directory for uploaded images

## 🔧 Development

### Backend Development

```bash
cd backend
mvn spring-boot:run
```

### Mobile Development

```bash
cd mobile
npm start
```

## 📝 Notes

- Images are stored in `/app/uploads` directory (configurable)
- Maximum 50 images per couple
- Maximum 10 custom quick messages per couple
- Pairing codes expire after 5 minutes
- JWT tokens expire after 24 hours
- Refresh tokens expire after 7 days

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `docker ps`
- Check database credentials in `.env`
- Verify network connectivity between containers

### Image Upload Issues

- Check upload directory permissions
- Verify `UPLOAD_DIR` path is correct
- Ensure sufficient disk space

### Mobile App Connection Issues

- Verify `API_BASE_URL` in `mobile/src/services/api.ts`
- Check backend is running: `curl http://localhost:8080/api/couple/status`
- Ensure firewall allows connections

## 📄 License

This project is proprietary software.

## 👥 Support

For issues and questions, please contact the development team.


# Testing Guide - Step by Step

## Prerequisites Check

Before testing, ensure you have:
- ✅ Docker and Docker Compose installed
- ✅ Node.js 18+ installed (for mobile app)
- ✅ React Native development environment set up
- ✅ Android Studio / Xcode (for mobile testing)

## Step 1: Start the Backend

### 1.1 Configure Environment

```bash
cd /home/warmdev/Workspace/MobileApp/Dating
cp env.example .env
# Edit .env if needed (you've already set the database password)
```

### 1.2 Start Docker Services

```bash
# Start PostgreSQL and Backend
docker compose up -d

# Check if services are running
docker compose ps

# You should see:
# - couples_db (postgres) - running
# - couples_backend - running
```

### 1.3 Initialize Database

```bash
# Wait a few seconds for database to be ready
sleep 5

# Initialize schema
docker exec -i couples_db psql -U postgres -d couples_db < database/schema.sql

# Verify tables were created
docker exec -it couples_db psql -U postgres -d couples_db -c "\dt"
# Should show: users, couples, pairing_codes, slideshow_images, quick_messages
```

### 1.4 Test Backend API

```bash
# Test if backend is running (should return 401 - that's expected)
curl http://localhost:8080/api/couple/status

# Test registration endpoint
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "password": "password123",
    "displayName": "Test User 1",
    "dateOfBirth": "1990-01-01"
  }'

# Should return JSON with accessToken, refreshToken, etc.
```

## Step 2: Configure Mobile App

### 2.1 Install Dependencies

```bash
cd mobile
npm install
```

### 2.2 Configure API Endpoint

Edit `mobile/src/config/api.ts`:

**For Android Emulator:**
```typescript
BASE_URL: 'http://10.0.2.2:8080/api',
```

**For iOS Simulator:**
```typescript
BASE_URL: 'http://localhost:8080/api',
```

**For Physical Device (replace with your computer's IP):**
```typescript
BASE_URL: 'http://192.168.1.XXX:8080/api',  // Find your IP with: hostname -I
```

### 2.3 Find Your Server IP (for physical device)

```bash
# On Linux/Mac
hostname -I
# or
ip addr show | grep "inet "

# On Windows
ipconfig
```

Update `mobile/src/config/api.ts` with your actual IP address.

## Step 3: Run Mobile App

### For Android

```bash
cd mobile

# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### For iOS

```bash
cd mobile

# Install CocoaPods dependencies
cd ios
pod install
cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## Step 4: Test Features

### Test 1: User Registration

1. Open the app
2. Tap "Don't have an account? Register"
3. Fill in:
   - Username: `user1`
   - Display Name: `User One`
   - Password: `password123`
   - Date of Birth: Select a date
4. Tap "Register"
5. ✅ Should automatically log in and show pairing screen

### Test 2: User Registration (Second User)

1. Log out (or use another device/emulator)
2. Register a second user:
   - Username: `user2`
   - Display Name: `User Two`
   - Password: `password123`
   - Date of Birth: Select a date
3. ✅ Should show pairing screen

### Test 3: Pairing

**On User 1's device:**
1. Tap "Generate Pairing Code"
2. ✅ Should show a 6-digit code (e.g., "123456")
3. Note the code

**On User 2's device:**
1. Enter the 6-digit code from User 1
2. Tap "Pair"
3. ✅ Should show success and navigate to main app

**On User 1's device:**
1. ✅ Should automatically navigate to main app (if status is checked)

### Test 4: Relationship Timer

1. Navigate to "Timer" tab
2. ✅ Should display:
   - Days: 00
   - Hours: 00
   - Minutes: 00
   - Seconds: counting up
3. Wait a few seconds
4. ✅ Timer should update in real-time
5. Put app in background and resume
6. ✅ Timer should continue correctly

### Test 5: Slideshow - Upload Image

1. Navigate to "Photos" tab
2. Tap "Add Photo"
3. Select an image from gallery
4. ✅ Image should upload and appear in slideshow
5. ✅ Slideshow should auto-play (changes every 5 seconds)

### Test 6: Slideshow - Multiple Images

1. Upload 2-3 more images
2. ✅ All images should appear in thumbnail strip at bottom
3. ✅ Main slideshow should cycle through all images
4. ✅ Tap thumbnail to view fullscreen

### Test 7: Slideshow - Delete Image

1. Tap the "×" button on a thumbnail
2. Confirm deletion
3. ✅ Image should be removed from slideshow
4. ✅ Changes should sync (test on partner's device)

### Test 8: Quick Messages - Predefined

1. Navigate to "Messages" tab
2. ✅ Should see 3 predefined messages:
   - ❤️ I miss you
   - 😊 Thinking about you
   - ☕ Call me
3. Tap one of them
4. ✅ Should show "Sent" alert
5. ✅ Partner should receive notification (if push notifications are set up)

### Test 9: Quick Messages - Create Custom

1. Tap "+ Add Custom Message"
2. Enter: "Good morning! ☀️"
3. Tap "Create"
4. ✅ Message should appear in list
5. Tap the message
6. ✅ Should send notification

### Test 10: Quick Messages - Delete Custom

1. Long press or tap delete on a custom message
2. Confirm deletion
3. ✅ Message should be removed

### Test 11: Logout and Re-login

1. Add logout functionality (or clear app data)
2. Log in with existing credentials
3. ✅ Should restore previous state
4. ✅ Timer should continue from where it left off
5. ✅ Slideshow images should load
6. ✅ Quick messages should load

## Step 5: Test Edge Cases

### Edge Case 1: Expired Pairing Code

1. Generate a pairing code
2. Wait 5+ minutes
3. Try to use the code
4. ✅ Should show "Invalid or expired pairing code" error

### Edge Case 2: Invalid Pairing Code

1. Enter a random 6-digit code
2. ✅ Should show error

### Edge Case 3: Already Paired User

1. Try to generate a pairing code when already paired
2. ✅ Should show "User is already paired" error

### Edge Case 4: Maximum Images

1. Upload images until you reach 50
2. Try to upload one more
3. ✅ Should show "Maximum number of images reached" error

### Edge Case 5: Maximum Messages

1. Create custom messages until you reach 10
2. Try to create one more
3. ✅ Button should be disabled or show error

### Edge Case 6: Long Message

1. Try to create a message longer than 50 characters
2. ✅ Should show validation error

## Step 6: Test API Directly (Optional)

### Using curl or Postman

```bash
# 1. Register User 1
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "api_user1",
    "password": "password123",
    "displayName": "API User 1",
    "dateOfBirth": "1990-01-01"
  }'

# Save the accessToken from response

# 2. Generate Pairing Code
curl -X POST http://localhost:8080/api/pair/code \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Register User 2
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "api_user2",
    "password": "password123",
    "displayName": "API User 2",
    "dateOfBirth": "1990-01-01"
  }'

# 4. Confirm Pairing (use code from step 2)
curl -X POST http://localhost:8080/api/pair/confirm \
  -H "Authorization: Bearer USER2_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'

# 5. Get Couple Status
curl http://localhost:8080/api/couple/status \
  -H "Authorization: Bearer USER1_ACCESS_TOKEN"

# 6. Get Timer
curl http://localhost:8080/api/couple/timer \
  -H "Authorization: Bearer USER1_ACCESS_TOKEN"
```

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker compose logs backend

# Common issues:
# - Port 8080 already in use: Change SERVER_PORT in .env
# - Database connection failed: Check DATABASE_PASSWORD in .env
```

### Database Connection Error

```bash
# Check if database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Test connection
docker exec -it couples_db psql -U postgres -d couples_db
```

### Mobile App Can't Connect

1. **Check API URL**: Verify `mobile/src/config/api.ts` has correct URL
2. **Check Backend**: `curl http://localhost:8080/api/couple/status`
3. **Check Network**: 
   - Android emulator: Use `10.0.2.2`
   - iOS simulator: Use `localhost`
   - Physical device: Use your computer's IP address
4. **Check Firewall**: Ensure port 8080 is not blocked

### Images Not Uploading

```bash
# Check upload directory permissions
ls -la /home/warmdev/Workspace/MobileApp/Dating/uploads

# Check backend logs
docker compose logs backend | grep -i upload
```

### Timer Not Updating

1. Check if couple is paired: `GET /api/couple/status`
2. Check timer endpoint: `GET /api/couple/timer`
3. Verify app is fetching timer data on mount

## Success Criteria

✅ All tests pass
✅ No errors in console/logs
✅ Data persists after app restart
✅ Changes sync between paired users
✅ Timer updates in real-time
✅ Images upload and display correctly
✅ Messages send successfully

## Next Steps After Testing

1. Fix any bugs found during testing
2. Set up push notifications (FCM)
3. Deploy to production server
4. Set up SSL/HTTPS
5. Configure monitoring
6. Set up automated backups


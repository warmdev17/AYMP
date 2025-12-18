# API Documentation

Base URL: `http://your-server:8080/api`

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "username": "string (3-50 chars, unique)",
  "password": "string (min 6 chars)",
  "displayName": "string (max 100 chars)",
  "dateOfBirth": "YYYY-MM-DD"
}
```

Response:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "userId": 1,
  "username": "string",
  "displayName": "string"
}
```

### Login
**POST** `/auth/login`

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response: Same as register

---

## Pairing Endpoints

### Generate Pairing Code
**POST** `/pair/code`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "code": "123456",
  "expiresInSeconds": 300
}
```

### Confirm Pairing
**POST** `/pair/confirm`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "code": "123456"
}
```

Response: `200 OK`

---

## Couple Endpoints

### Get Couple Status
**GET** `/couple/status`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "isPaired": true,
  "coupleId": 1,
  "partnerId": 2,
  "partnerDisplayName": "Partner Name",
  "pairedAt": "2024-01-01T00:00:00"
}
```

### Get Timer Data
**GET** `/couple/timer`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "pairedAt": "2024-01-01T00:00:00",
  "totalSeconds": 86400
}
```

---

## Slideshow Endpoints

### Upload Image
**POST** `/slideshow/upload`

Headers: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

Request: Form data with `file` field

Response:
```json
{
  "id": 1,
  "imageUrl": "/uploads/filename.jpg",
  "orderIndex": 0,
  "uploadedByUserId": 1,
  "createdAt": "2024-01-01T00:00:00"
}
```

### Get Slideshow
**GET** `/slideshow`

Headers: `Authorization: Bearer <token>`

Response:
```json
[
  {
    "id": 1,
    "imageUrl": "/uploads/filename.jpg",
    "orderIndex": 0,
    "uploadedByUserId": 1,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### Reorder Images
**PUT** `/slideshow/reorder`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "imageIds": [3, 1, 2]
}
```

Response: `200 OK`

### Delete Image
**DELETE** `/slideshow/{id}`

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

---

## Quick Message Endpoints

### Get Messages
**GET** `/quick-messages`

Headers: `Authorization: Bearer <token>`

Response:
```json
[
  {
    "id": 1,
    "content": "Custom message",
    "createdByUserId": 1,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### Create Message
**POST** `/quick-messages`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "content": "string (max 50 chars)"
}
```

Response:
```json
{
  "id": 1,
  "content": "Custom message",
  "createdByUserId": 1,
  "createdAt": "2024-01-01T00:00:00"
}
```

### Delete Message
**DELETE** `/quick-messages/{id}`

Headers: `Authorization: Bearer <token>`

Response: `200 OK`

---

## Notification Endpoints

### Send Quick Notification
**POST** `/notify/quick`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "message": "string"
}
```

Response: `200 OK`

### Send Custom Notification
**POST** `/notify/custom`

Headers: `Authorization: Bearer <token>`

Request Body:
```json
{
  "message": "string"
}
```

Response: `200 OK`

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message"
}
```

Status Codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error


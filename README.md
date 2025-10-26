# URL Shortener - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Environment Configuration](#environment-configuration)
6. [Data Models](#data-models)
7. [API Reference](#api-reference)
   - [Authentication Endpoints](#authentication-endpoints)
   - [URL Management](#url-management)
   - [Folder Management](#folder-management)
   - [Analytics](#analytics)
   - [User Utilities](#user-utilities)
8. [Authentication & Security](#authentication--security)
9. [Error Handling](#error-handling)
10. [Deployment](#deployment)
11. [Development Setup](#development-setup)
12. [License](#license)

---

## Overview

A production-ready URL shortener application featuring user accounts, folder organization, tag management, server-side analytics aggregation, and a responsive React frontend. The system provides comprehensive link management with detailed analytics and organizational tools.

- **Links:** **[Live Site](https://url-shortener-frontend-q3gy.onrender.com/)** | **[Demo video](https://youtu.be/a0UaPkrp4fE?si=1z83eoTak34IppHf)**

**Key Features:**

- User registration and authentication
- Custom and auto-generated short URLs
- Folder-based organization
- Tag system for categorization
- Comprehensive analytics with geographical and device tracking
- Bulk operations for link management
- Responsive web interface
- RESTful API architecture

**Deployment:**

- Backend: Node.js/Express API deployed on Render
- Frontend: React SPA deployed separately
- Database: MongoDB Atlas cluster

---

## Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

- **Frontend**: Single Page Application (React) communicating via RESTful API
- **Backend**: Node.js/Express server with MongoDB database
- **Analytics**: Server-side click tracking with daily aggregation
- **Authentication**: JWT-based with httpOnly cookies or Bearer tokens
- **Deployment**: Separate deployments with CORS-enabled communication

---

## Technology Stack

### Backend Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Analytics**: geoip-lite for geographical data, ua-parser-js for device detection
- **Security**: CORS, httpOnly cookies, proxy trust configuration

### Frontend Technologies

- **Framework**: React 18
- **Routing**: TanStack Router
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Deployment Infrastructure

- **Hosting**: Render (both frontend and backend)
- **Database**: MongoDB Atlas
- **CDN**: Static asset delivery via Render
- **SSL**: Automatic HTTPS termination

---

## Project Structure

### Monorepo Organization

```
root/
├── backend/
│   ├── app.js                    # Express application entry point
│   └── src/
│       ├── config/              # Configuration files
│       ├── controller/          # Route handlers
│       ├── dao/                # Data access objects
│       ├── errors/             # Custom error classes
│       ├── middlewares/        # Express middlewares
│       ├── models/             # Mongoose schemas
│       ├── routes/             # Route definitions
│       ├── services/           # Business logic
│       └── utils/              # Utility functions
└── frontend/
    └── src/
        ├── api/                # API client functions
        ├── components/         # React components
        ├── hooks/              # Custom React hooks
        ├── context/            # React context providers
        └── utils/              # Frontend utilities
```

### Backend Structure Detail

```
backend/src/
├── config/
│   ├── mongo.config.js         # MongoDB connection configuration
│   └── config.js               # Application configuration
├── controller/
│   ├── analytics.controller.js  # Analytics endpoint handlers
│   ├── auth.controller.js       # Authentication handlers
│   ├── folder.controller.js     # Folder management handlers
│   ├── shortUrl.controller.js   # URL management handlers
│   └── user.controller.js       # User-related handlers
├── dao/
│   ├── analytics.dao.js         # Analytics data access
│   ├── folder.dao.js            # Folder data access
│   ├── shortUrl.dao.js          # URL data access
│   └── user.dao.js              # User data access
├── errors/
│   └── AppError.js              # Custom application error class
├── middlewares/
│   ├── assetsHandler.middleware.js  # Static asset handling
│   ├── auth.middleware.js           # Authentication middleware
│   ├── error.middleware.js          # Error handling middleware
│   └── notFound.middleware.js       # 404 handler
├── models/
│   ├── clickAgg.model.js        # Click aggregation schema
│   ├── folder.model.js          # Folder schema
│   ├── shortUrl.model.js        # Short URL schema
│   └── user.model.js            # User schema
├── routes/
│   ├── analytics.route.js       # Analytics routes
│   ├── auth.route.js            # Authentication routes
│   ├── folder.route.js          # Folder routes
│   └── shortUrl.route.js        # URL routes
└── utils/
    ├── analyticsRange.js        # Analytics date range utilities
    ├── attachUser.js            # User attachment utilities
    ├── helper.utils.js          # General helper functions
    └── wrapAsync.js             # Async error wrapper
```

### Frontend Structure Detail

```
frontend/src/
├── api/
│   └── shortUrl.api.js          # API client methods
├── components/
│   ├── UrlForm.jsx              # URL creation form
│   ├── UserUrls.jsx             # URL listing component
│   ├── FolderSidebar.jsx        # Folder navigation
│   ├── TagEditor.jsx            # Tag management interface
│   ├── modals/
│   │   └── ConfirmModals.jsx    # Confirmation dialogs
│   └── user-urls/
│       ├── BulkToolbar.jsx      # Desktop bulk operations
│       ├── MobileBulkToolbar.jsx # Mobile bulk operations
│       ├── UrlRow.jsx           # URL list item (desktop)
│       ├── UrlCard.jsx          # URL card (mobile)
│       ├── FolderSelect.jsx     # Folder selection dropdown
│       ├── TagBulkUrl.jsx       # Bulk tag operations
│       ├── StatusPill.jsx       # Status indicator
│       └── NoUrlsCard.jsx       # Empty state component
├── hooks/                       # Custom React hooks
├── context/
│   └── ToastContext.jsx         # Toast notification system
└── utils/
    └── publicBase.js            # Public API utilities
```

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration
PORT=5000                        # Render sets this automatically in production
NODE_ENV=production              # development | production

# Application Configuration
APP_URL=https://url-shortener-backend-xxx.onrender.com

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key

# CORS Configuration (comma-separated URLs)
CORS_ORIGINS=https://url-shortener-frontend-xxx.onrender.com,https://yourdomain.com
```

### Configuration Details

#### CORS Configuration

- **Purpose**: Whitelist allowed origins for cross-origin requests
- **Format**: Comma-separated list of complete URLs
- **Security**: Requests from unlisted origins are automatically rejected
- **Credentials**: Enabled for cookie-based authentication

#### Cookie Configuration

- **Production**: `sameSite: 'none'`, `secure: true`, `httpOnly: true`
- **Development**: `sameSite: 'strict'`, `secure: false`, `httpOnly: true`
- **Name**: `accessToken`
- **Expiration**: 1 hour (configurable)

#### Proxy Configuration

- **Setting**: `trust proxy: 1`
- **Purpose**: Proper IP address and protocol detection behind reverse proxy
- **Platforms**: Render, Heroku, and similar PaaS providers

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String,                    // Display name
  email: String,                   // Unique identifier
  password: String,                // Bcrypt hashed
  avatar: String,                  // Gravatar URL
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email`: unique index for authentication

### Short URL Model

```javascript
{
  _id: ObjectId,
  fullUrl: String,                 // Original URL
  shortUrl: String,                // Short identifier/slug
  clicks: Number,                  // Total click count
  user: ObjectId,                  // Reference to User (optional)
  status: String,                  // 'active' | 'paused' | 'disabled'
  tags: [String],                  // User-defined tags
  folderId: ObjectId,              // Reference to Folder (optional)
  deletedAt: Date,                 // Soft delete timestamp
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `shortUrl`: unique index for fast lookup
- `user`: compound index with other fields for user queries
- `status`: filtering by status
- `createdAt`: date-based sorting

### Folder Model

```javascript
{
  _id: ObjectId,
  name: String,                    // Folder name
  user: ObjectId,                  // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

**Constraints:**

- Unique folder names per user

### Click Aggregation Model

```javascript
{
  _id: ObjectId,
  linkId: ObjectId,                // Reference to ShortUrl
  day: Date,                       // Date (start of day UTC)
  total: Number,                   // Total clicks for the day
  country: Map,                    // Country code -> count
  referrer: Map,                   // Referrer domain -> count
  device: {
    desktop: Number,
    mobile: Number,
    tablet: Number,
    bot: Number,
    other: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `linkId, day`: compound unique index for efficient aggregation queries

---

## API Reference

**Base URL (Production):** `https://url-shortener-backend-xxx.onrender.com`

**Content Type:** All requests and responses use `application/json`

**Authentication:** JWT tokens via httpOnly cookies or `Authorization: Bearer` headers

### URL Redirection

#### GET `/:id`

Resolve a short URL slug and redirect to the original URL.

**Parameters:**

- `id` (path): Short URL identifier

**Response:**

- `302 Found`: Successful redirect
- `403 Forbidden`: Link is paused
- `404 Not Found`: Link not found or disabled

**Example:**

```http
GET /abc123
Location: https://example.com/original-url
```

**Analytics:** Each successful redirect records analytics data asynchronously.

---

### Authentication Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully"
}
```

**Side Effects:**

- Sets `accessToken` httpOnly cookie
- Generates Gravatar avatar URL

**Validation:**

- Email must be unique
- Password minimum 8 characters
- All fields required

---

#### POST `/api/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "_id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "avatar": "https://www.gravatar.com/avatar/...?d=identicon",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "User logged in successfully"
}
```

**Side Effects:**

- Sets `accessToken` httpOnly cookie

---

#### POST `/api/auth/logout`

End user session.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Side Effects:**

- Clears `accessToken` cookie

---

#### GET `/api/auth/me`

Get current user information.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "user": {
    "_id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "avatar": "https://www.gravatar.com/avatar/...?d=identicon"
  }
}
```

---

### URL Management

#### POST `/api/create`

Create a new short URL.

**Authentication:** Optional (anonymous links supported)

**Request Body:**

```json
{
  "url": "https://example.com/very/long/path?with=parameters",
  "slug": "custom-slug" // Optional, authenticated users only
}
```

**Response (201 Created):**

```json
{
  "shortUrl": "https://url-shortener-backend-xxx.onrender.com/custom-slug"
}
```

**Validation:**

- URL must be valid HTTP/HTTPS
- Custom slugs only for authenticated users
- Slug must be unique (alphanumeric, hyphens, underscores)

**Errors:**

- `400 Bad Request`: Invalid URL format
- `409 Conflict`: Custom slug already taken

---

#### GET `/api/links`

List user's short URLs with pagination.

**Authentication:** Required

**Query Parameters:**

- `limit` (1-100, default: 50): Items per page
- `cursor` (string): Pagination cursor from previous response
- `folderId` (ObjectId|null): Filter by folder
- `status` (active|paused|disabled): Filter by status
- `q` (string): Search in full URLs (case-insensitive)
- `tags` (comma-separated): Filter by tags (all must match)
- `from` (ISO date): Filter by creation date (start)
- `to` (ISO date): Filter by creation date (end)

**Response (200 OK):**

```json
{
  "items": [
    {
      "_id": "66f1234567890abcdef12345",
      "fullUrl": "https://example.com/long-url",
      "shortUrl": "abc123",
      "clicks": 42,
      "status": "active",
      "tags": ["marketing", "q3", "campaign-a"],
      "folderId": "66e9876543210fedcba09876",
      "user": "66d1111111111111111111111",
      "createdAt": "2025-01-02T09:12:33.123Z",
      "updatedAt": "2025-01-02T09:12:33.123Z"
    }
  ],
  "nextCursor": "1735776133123_66f1234567890abcdef12345"
}
```

**Pagination:**

- Use `nextCursor` from response for subsequent requests
- `null` cursor indicates end of results

---

#### POST `/api/links/batch`

Perform bulk operations on multiple links.

**Authentication:** Required

**Request Body:**

```json
{
  "op": "pause",
  "ids": ["66f1234567890abcdef12345", "66f1234567890abcdef12346"],
  "payload": {}
}
```

**Supported Operations:**

| Operation      | Description                | Payload                            |
| -------------- | -------------------------- | ---------------------------------- |
| `pause`        | Set status to paused       | None                               |
| `resume`       | Set status to active       | None                               |
| `disable`      | Soft delete (set disabled) | None                               |
| `moveToFolder` | Change folder              | `{"folderId": "ObjectId or null"}` |
| `addTags`      | Add tags to existing       | `{"tags": ["tag1", "tag2"]}`       |
| `removeTags`   | Remove specific tags       | `{"tags": ["tag1", "tag2"]}`       |
| `hardDelete`   | Permanently delete         | None                               |

**Response (200 OK):**

```json
{
  "message": "Batch processed",
  "changed": 2
}
```

**Hard Delete Response:**

```json
{
  "ok": true,
  "op": "hardDelete",
  "attempted": 2,
  "deletedCount": 2
}
```

---

#### PATCH `/api/links/:id/status`

Update the status of a single link.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Request Body:**

```json
{
  "status": "paused" // active | paused | disabled
}
```

**Response (200 OK):**

```json
{
  "message": "Status updated",
  "link": {
    "_id": "66f1234567890abcdef12345",
    "status": "paused",
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

---

#### DELETE `/api/links/:id`

Soft delete a link (sets status to disabled).

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Response (200 OK):**

```json
{
  "message": "Link disabled (soft deleted)",
  "link": {
    "_id": "66f1234567890abcdef12345",
    "status": "disabled",
    "deletedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

---

#### DELETE `/api/links/:id/permanent`

Permanently delete a link (irreversible).

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Response (200 OK):**

```json
{
  "message": "Link permanently deleted"
}
```

**Warning:** This operation cannot be undone and will also delete all associated analytics data.

---

#### PATCH `/api/links/:id/tags`

Replace the tag list for a link.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Request Body:**

```json
{
  "tags": ["marketing", "q3", "campaign-a"]
}
```

**Response (200 OK):**

```json
{
  "message": "Tags updated",
  "link": {
    "_id": "66f1234567890abcdef12345",
    "tags": ["marketing", "q3", "campaign-a"],
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

**Processing:**

- Tags are normalized (trimmed, lowercased)
- Duplicates are automatically removed
- Empty tags are filtered out

---

#### PATCH `/api/links/:id/folder`

Move a link to a different folder.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Request Body:**

```json
{
  "folderId": "66e9876543210fedcba09876" // ObjectId or null for unfiled
}
```

**Response (200 OK):**

```json
{
  "message": "Folder updated",
  "link": {
    "_id": "66f1234567890abcdef12345",
    "folderId": "66e9876543210fedcba09876",
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

**Errors:**

- `404 Not Found`: Folder doesn't exist or not owned by user
- `404 Not Found`: Link doesn't exist or not owned by user

---

#### PATCH `/api/links/:id/restore`

Restore a soft-deleted link.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ObjectId

**Response (200 OK):**

```json
{
  "message": "Link restored",
  "link": {
    "_id": "66f1234567890abcdef12345",
    "status": "active",
    "deletedAt": null,
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

---

### Folder Management

#### GET `/api/folders`

List user's folders.

**Authentication:** Required

**Query Parameters:**

- `withCounts` (1|0): Include link counts per folder

**Response (200 OK):**

```json
{
  "folders": [
    {
      "_id": "66e9876543210fedcba09876",
      "name": "Marketing Campaigns",
      "user": "66d1111111111111111111111",
      "count": 12 // Only if withCounts=1
    }
  ]
}
```

---

#### POST `/api/folders`

Create a new folder.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "Q4 Campaigns"
}
```

**Response (201 Created):**

```json
{
  "folder": {
    "_id": "66e9876543210fedcba09876",
    "name": "Q4 Campaigns",
    "user": "66d1111111111111111111111",
    "createdAt": "2025-01-02T10:30:00.000Z",
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

**Constraints:**

- Folder names must be unique per user
- Maximum length: 50 characters

---

#### PATCH `/api/folders/:id`

Rename a folder.

**Authentication:** Required

**Parameters:**

- `id` (path): Folder ObjectId

**Request Body:**

```json
{
  "name": "Q4 Marketing Campaigns"
}
```

**Response (200 OK):**

```json
{
  "folder": {
    "_id": "66e9876543210fedcba09876",
    "name": "Q4 Marketing Campaigns",
    "user": "66d1111111111111111111111",
    "updatedAt": "2025-01-02T10:30:00.000Z"
  }
}
```

---

#### DELETE `/api/folders/:id`

Delete a folder and move contained links to unfiled.

**Authentication:** Required

**Parameters:**

- `id` (path): Folder ObjectId

**Response (200 OK):**

```json
{
  "message": "Folder removed and links unfiled"
}
```

**Side Effects:**

- All links in the folder are moved to unfiled status
- Folder deletion is permanent

---

### Analytics

#### GET `/api/analytics/:linkId/timeseries`

Get daily click counts for a link over a date range.

**Authentication:** Required

**Parameters:**

- `linkId` (path): Link ObjectId

**Query Parameters:**

- `from` (ISO date, optional): Start date (default: 30 days ago)
- `to` (ISO date, optional): End date (default: today)

**Response (200 OK):**

```json
{
  "series": [
    {
      "day": "2025-01-01T00:00:00.000Z",
      "total": 5
    },
    {
      "day": "2025-01-02T00:00:00.000Z",
      "total": 12
    }
  ]
}
```

**Date Handling:**

- All dates are in UTC
- Missing days are filled with zero values
- Maximum range: 365 days

---

#### GET `/api/analytics/:linkId/breakdown`

Get top categories for a specific dimension over a date range.

**Authentication:** Required

**Parameters:**

- `linkId` (path): Link ObjectId

**Query Parameters:**

- `dim` (country|referrer|device, default: country): Dimension to analyze
- `from` (ISO date, optional): Start date
- `to` (ISO date, optional): End date
- `limit` (1-50, default: 10): Number of top results

**Response (200 OK):**

```json
{
  "dimension": "referrer",
  "rows": [
    {
      "label": "direct",
      "count": 42
    },
    {
      "label": "twitter.com",
      "count": 17
    },
    {
      "label": "facebook.com",
      "count": 8
    }
  ]
}
```

**Dimension Details:**

- `country`: ISO country codes (US, GB, DE, etc.)
- `referrer`: Domain names or "direct" for direct traffic
- `device`: desktop, mobile, tablet, bot, other

---

### User Utilities

#### GET `/api/user/urls`

Convenience endpoint to list user URLs with simple filtering.

**Authentication:** Required

**Query Parameters:**

- `folderId` (ObjectId|"unfiled"): Filter by folder
- `tag` (string): Filter by single tag

**Response (200 OK):**

```json
{
  "urls": [
    {
      "_id": "66f1234567890abcdef12345",
      "fullUrl": "https://example.com/long-url",
      "shortUrl": "abc123",
      "tags": ["marketing", "q3"]
    }
  ]
}
```

**Response (404 Not Found):**

```json
{
  "message": "No URLs found"
}
```

---

## Authentication & Security

### Authentication Methods

The API supports two authentication methods:

1. **HTTP-Only Cookies** (Recommended for web browsers)

   - Cookie name: `accessToken`
   - Automatically set on login/register
   - Requires `credentials: 'include'` in fetch requests
   - Secure and httpOnly flags in production

2. **Bearer Tokens** (For API clients)
   - Header: `Authorization: Bearer <jwt-token>`
   - Suitable for mobile apps and server-to-server communication

### JWT Token Structure

```javascript
{
  "sub": "66d1111111111111111111111",  // User ID
  "email": "user@example.com",
  "iat": 1735776133,                   // Issued at
  "exp": 1735779733                    // Expires at (1 hour)
}
```

### Security Features

#### CORS Configuration

- Strict origin whitelist via `CORS_ORIGINS` environment variable
- Credentials enabled for cookie authentication
- Preflight request handling for complex requests

#### Cookie Security

- `httpOnly`: Prevents XSS access to tokens
- `secure`: HTTPS-only in production
- `sameSite`: 'none' for cross-origin requests in production

#### Request Security

- Rate limiting (implementation dependent)
- Request size limits via Express built-in middleware
- Input validation and sanitization

#### Database Security

- Mongoose schema validation
- Parameterized queries prevent SQL injection
- User data isolation through ownership checks

### Password Security

- Bcrypt hashing with salt rounds (configurable)
- Minimum password requirements enforced
- No password storage in JWT tokens

---

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                                    |
| ---- | --------------------- | ---------------------------------------- |
| 400  | Bad Request           | Invalid input, validation errors         |
| 401  | Unauthorized          | Missing or invalid authentication        |
| 403  | Forbidden             | Valid auth but insufficient permissions  |
| 404  | Not Found             | Resource doesn't exist                   |
| 409  | Conflict              | Resource conflict (duplicate slug, etc.) |
| 413  | Payload Too Large     | Request body exceeds size limit          |
| 429  | Too Many Requests     | Rate limit exceeded                      |
| 500  | Internal Server Error | Unexpected server errors                 |

### Error Categories

#### Validation Errors (400)

- Missing required fields
- Invalid data formats
- Business rule violations

**Example:**

```json
{
  "success": false,
  "error": "URL is required and must be a valid HTTP/HTTPS URL"
}
```

#### Authentication Errors (401)

- Missing JWT token
- Expired token
- Invalid token signature

**Example:**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### Authorization Errors (403)

- Link paused (for redirects)
- Accessing another user's resources

**Example:**

```json
{
  "success": false,
  "error": "This link has been paused by the owner"
}
```

#### Resource Errors (404)

- Link not found
- User not found
- Folder not found

**Example:**

```json
{
  "success": false,
  "error": "Link not found"
}
```

### Error Handling Best Practices

#### Client-Side Handling

```javascript
try {
  const response = await fetch("/api/links", {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("API Error:", error.message);
  // Handle error appropriately
}
```

#### Server-Side Logging

- All errors are logged with appropriate context
- Sensitive information excluded from client responses
- Error tracking integration ready

---

## Deployment

### Render Deployment Configuration

#### Backend Service

1. **Service Type**: Web Service
2. **Runtime**: Node.js
3. **Build Command**: `npm install`
4. **Start Command**: `node app.js`
5. **Environment Variables**: Set all required variables from configuration section

#### Frontend Service

1. **Service Type**: Static Site or Web Service
2. **Runtime**: Node.js (for build process)
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist` (or build output directory)

### Environment Configuration

#### Production Checklist

- [ ] `NODE_ENV=production`
- [ ] Secure `JWT_SECRET` (minimum 32 characters)
- [ ] Correct `APP_URL` pointing to backend service
- [ ] Complete `CORS_ORIGINS` with all frontend URLs
- [ ] Valid `MONGO_URL` with proper credentials

#### SSL and Domain Setup

- Render provides automatic SSL certificates
- Custom domains supported with DNS configuration
- HTTPS enforced in production environment

### Database Setup

#### MongoDB Atlas Configuration

1. Create cluster with appropriate tier
2. Configure network access (0.0.0.0/0 for cloud deployment)
3. Create database user with read/write permissions
4. Obtain connection string for `MONGO_URL`

#### Index Creation

Ensure proper indexes exist for optimal performance:

```javascript
// Short URL collection
db.shorturls.createIndex({ shortUrl: 1 }, { unique: true });
db.shorturls.createIndex({ user: 1, createdAt: -1 });
db.shorturls.createIndex({ user: 1, status: 1 });

// User collection
db.users.createIndex({ email: 1 }, { unique: true });

// Folder collection
db.folders.createIndex({ user: 1, name: 1 }, { unique: true });

// Click aggregation collection
db.clickaggs.createIndex({ linkId: 1, day: 1 }, { unique: true });
```

### Monitoring and Maintenance

#### Health Checks

The application includes basic health check endpoints for monitoring service availability:

```javascript
// GET /health
{
  "status": "ok",
  "timestamp": "2025-01-02T10:30:00.000Z",
  "database": "connected"
}
```

#### Performance Monitoring

- Response time tracking via Express middleware
- Database query performance monitoring
- Error rate tracking and alerting
- Resource usage monitoring (CPU, memory)

#### Backup Strategy

- MongoDB Atlas provides automatic backups
- Point-in-time recovery available
- Regular backup testing recommended
- Export critical data for disaster recovery

#### Scaling Considerations

- Horizontal scaling supported via multiple service instances
- Database connection pooling configured
- Static asset caching via CDN
- Analytics aggregation optimized for performance

---

## Development Setup

### Prerequisites

- **Node.js**: Version 18+ (LTS recommended)
- **MongoDB**: Local instance or Atlas connection
- **Git**: For version control
- **Package Manager**: npm or yarn

### Local Installation

#### Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd url-shortener

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

#### Frontend Setup

```bash
# Install frontend dependencies
cd ../frontend
npm install

# Start development server
npm run dev
```

### Development Environment Variables

Create `.env` file in backend directory:

```bash
# Development configuration
NODE_ENV=development
PORT=5000
MONGO_URL=mongodb://localhost:27017/urlshortener
APP_URL=http://localhost:5000
JWT_SECRET=development-jwt-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Development Scripts

#### Backend Scripts

```json
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

#### Frontend Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

### Development Workflow

#### Code Structure Guidelines

- Follow established folder structure
- Implement proper error handling
- Add JSDoc comments for public APIs
- Write unit tests for critical functions
- Use consistent naming conventions

#### Database Seeding

```bash
# Run database seeders (if available)
npm run seed

# Reset database
npm run db:reset
```

#### Testing Strategy

- Unit tests for utility functions
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Performance tests for analytics aggregation

### API Testing with cURL

#### Authentication Flow

```bash
# Set base URL
BASE_URL="http://localhost:5000"

# Register user
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Login and save cookies
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Test authenticated endpoint
curl -X GET "$BASE_URL/api/links" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

#### Link Management

```bash
# Create short URL
curl -X POST "$BASE_URL/api/create" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","slug":"test"}' \
  -b cookies.txt

# List user links
curl -X GET "$BASE_URL/api/links?limit=10" \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Batch operations
curl -X POST "$BASE_URL/api/links/batch" \
  -H "Content-Type: application/json" \
  -d '{"op":"pause","ids":["LINK_ID_1","LINK_ID_2"]}' \
  -b cookies.txt
```

### Debugging

#### Backend Debugging

- Use `console.log()` for development debugging
- Implement structured logging for production
- MongoDB queries logged in development mode
- Error stack traces available in development

#### Frontend Debugging

- React Developer Tools browser extension
- TanStack Query Devtools for state inspection
- Network tab for API request debugging
- Console logging for state changes

### Hot Reloading

#### Backend (Nodemon)

```javascript
// nodemon.json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["node_modules", "*.test.js"],
  "exec": "node app.js"
}
```

#### Frontend (Vite)

- Automatic hot module replacement
- Fast refresh for React components
- Instant updates for CSS changes
- Source map support for debugging

---

## API Examples

### Complete Workflow Examples

#### User Registration and First Link

```bash
# 1. Register new user
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt

# 2. Create first link
curl -X POST "http://localhost:5000/api/create" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/my-landing-page",
    "slug": "landing"
  }' \
  -b cookies.txt

# 3. Create a folder
curl -X POST "http://localhost:5000/api/folders" \
  -H "Content-Type: application/json" \
  -d '{"name": "Marketing"}' \
  -b cookies.txt

# 4. List links to get IDs
curl -X GET "http://localhost:5000/api/links" \
  -b cookies.txt
```

#### Bulk Operations Example

```bash
# Get link IDs first
LINK_IDS='["66f1234567890abcdef12345","66f1234567890abcdef12346"]'

# Pause multiple links
curl -X POST "http://localhost:5000/api/links/batch" \
  -H "Content-Type: application/json" \
  -d "{\"op\":\"pause\",\"ids\":$LINK_IDS}" \
  -b cookies.txt

# Add tags to multiple links
curl -X POST "http://localhost:5000/api/links/batch" \
  -H "Content-Type: application/json" \
  -d "{\"op\":\"addTags\",\"ids\":$LINK_IDS,\"payload\":{\"tags\":[\"q4\",\"promo\"]}}" \
  -b cookies.txt

# Move to folder
curl -X POST "http://localhost:5000/api/links/batch" \
  -H "Content-Type: application/json" \
  -d "{\"op\":\"moveToFolder\",\"ids\":$LINK_IDS,\"payload\":{\"folderId\":\"66e9876543210fedcba09876\"}}" \
  -b cookies.txt
```

#### Analytics Retrieval

```bash
# Get timeseries data for last 30 days
LINK_ID="66f1234567890abcdef12345"
curl -X GET "http://localhost:5000/api/analytics/$LINK_ID/timeseries" \
  -b cookies.txt

# Get country breakdown for specific date range
curl -X GET "http://localhost:5000/api/analytics/$LINK_ID/breakdown?dim=country&from=2025-01-01&to=2025-01-31&limit=20" \
  -b cookies.txt

# Get referrer breakdown
curl -X GET "http://localhost:5000/api/analytics/$LINK_ID/breakdown?dim=referrer&limit=10" \
  -b cookies.txt
```

### JavaScript/Fetch Examples

#### Frontend API Integration

```javascript
// API client configuration
const API_BASE = "https://url-shortener-backend-xxx.onrender.com";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Authentication methods
  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", { method: "POST" });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // Link management methods
  async createShortUrl(data) {
    return this.request("/api/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getLinks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/links${queryString ? `?${queryString}` : ""}`);
  }

  async batchOperation(operation, linkIds, payload = {}) {
    return this.request("/api/links/batch", {
      method: "POST",
      body: JSON.stringify({
        op: operation,
        ids: linkIds,
        payload,
      }),
    });
  }

  async updateLinkStatus(linkId, status) {
    return this.request(`/api/links/${linkId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateLinkTags(linkId, tags) {
    return this.request(`/api/links/${linkId}/tags`, {
      method: "PATCH",
      body: JSON.stringify({ tags }),
    });
  }

  // Folder methods
  async getFolders(withCounts = false) {
    const params = withCounts ? "?withCounts=1" : "";
    return this.request(`/api/folders${params}`);
  }

  async createFolder(name) {
    return this.request("/api/folders", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async deleteFolder(folderId) {
    return this.request(`/api/folders/${folderId}`, {
      method: "DELETE",
    });
  }

  // Analytics methods
  async getTimeseries(linkId, dateRange = {}) {
    const params = new URLSearchParams(dateRange).toString();
    return this.request(
      `/api/analytics/${linkId}/timeseries${params ? `?${params}` : ""}`
    );
  }

  async getBreakdown(linkId, dimension = "country", options = {}) {
    const params = new URLSearchParams({
      dim: dimension,
      ...options,
    }).toString();
    return this.request(
      `/api/analytics/${linkId}/breakdown${params ? `?${params}` : ""}`
    );
  }
}

// Usage example
const api = new ApiClient();

// Login and create a link
async function example() {
  try {
    await api.login({
      email: "user@example.com",
      password: "password123",
    });

    const result = await api.createShortUrl({
      url: "https://example.com",
      slug: "my-link",
    });

    console.log("Created:", result.shortUrl);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

### React Hook Examples

#### Custom Hook for Link Management

```javascript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../api/client";

const api = new ApiClient();

export function useLinks(filters = {}) {
  return useQuery({
    queryKey: ["links", filters],
    queryFn: () => api.getLinks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createShortUrl.bind(api),
    onSuccess: () => {
      // Invalidate and refetch links
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useBatchOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ operation, linkIds, payload }) =>
      api.batchOperation(operation, linkIds, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

// Usage in component
function LinkManager() {
  const { data: links, isLoading } = useLinks({ limit: 50 });
  const createLink = useCreateLink();
  const batchOp = useBatchOperation();

  const handleCreateLink = async (linkData) => {
    try {
      await createLink.mutateAsync(linkData);
      toast.success("Link created successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBatchPause = async (selectedIds) => {
    try {
      await batchOp.mutateAsync({
        operation: "pause",
        linkIds: selectedIds,
      });
      toast.success("Links paused successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Link management UI */}</div>;
}
```

---

## Performance Optimization

### Backend Optimization

#### Database Indexing Strategy

```javascript
// Compound indexes for common query patterns
db.shorturls.createIndex({ user: 1, createdAt: -1 }); // User's recent links
db.shorturls.createIndex({ user: 1, status: 1 }); // User's links by status
db.shorturls.createIndex({ user: 1, folderId: 1 }); // User's links by folder
db.shorturls.createIndex({ user: 1, tags: 1 }); // User's links by tags
db.clickaggs.createIndex({ linkId: 1, day: -1 }); // Analytics queries
```

#### Query Optimization

- Use pagination with cursors instead of offset/limit
- Implement field selection to reduce data transfer
- Aggregate analytics data at write time
- Cache frequently accessed data

#### Memory Management

```javascript
// MongoDB connection pooling
const mongooseOptions = {
  maxPoolSize: 10, // Maximum number of connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
};
```

### Frontend Optimization

#### Bundle Optimization

```javascript
// Vite configuration for optimal builds
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
```

#### Code Splitting

```javascript
// Lazy load components
const Analytics = lazy(() => import("./components/Analytics"));
const Settings = lazy(() => import("./components/Settings"));

// Route-based splitting
const routes = [
  {
    path: "/analytics",
    component: lazy(() => import("./pages/Analytics")),
  },
];
```

#### Data Fetching Optimization

```javascript
// Infinite scroll implementation
export function useInfiniteLinks(filters) {
  return useInfiniteQuery({
    queryKey: ["links", "infinite", filters],
    queryFn: ({ pageParam }) => api.getLinks({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}
```

### Caching Strategy

#### Browser Caching

- Static assets cached with long expiration
- API responses cached with appropriate headers
- Service worker for offline functionality

#### Server-Side Caching

- Redis for session storage (if implemented)
- Database query result caching
- CDN for static asset delivery

---

## Security Best Practices

### Input Validation and Sanitization

#### Backend Validation

```javascript
// URL validation middleware
const validateUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      success: false,
      error: "URL is required and must be a string",
    });
  }

  try {
    new URL(url);
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error("Invalid protocol");
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Invalid URL format",
    });
  }

  next();
};

// Slug validation
const validateSlug = (slug) => {
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slug.length >= 1 && slug.length <= 50 && slugRegex.test(slug);
};
```

#### Frontend Validation

```javascript
// Form validation with schema
const linkSchema = {
  url: {
    required: true,
    pattern: /^https?:\/\/.+/,
    message: "Please enter a valid HTTP or HTTPS URL",
  },
  slug: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    maxLength: 50,
    message:
      "Slug must contain only letters, numbers, hyphens, and underscores",
  },
};
```

### Rate Limiting

#### Implementation Options

```javascript
// Express rate limiting middleware
const rateLimit = require("express-rate-limit");

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests, please try again later",
  },
});

app.use("/api/create", createLimiter);
```

### SQL Injection Prevention

#### Mongoose Protection

- Always use Mongoose schema validation
- Avoid direct MongoDB queries with user input
- Use parameterized queries when necessary

### XSS Prevention

#### Output Encoding

- React automatically escapes JSX content
- Validate and sanitize HTML input
- Use Content Security Policy headers

### CSRF Protection

#### Token-Based Protection

```javascript
// CSRF middleware (if needed)
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);
```

---

## Troubleshooting

### Common Issues and Solutions

#### Authentication Problems

**Issue**: "Invalid or expired token"

```bash
# Check token expiration
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v
```

**Solutions**:

- Verify JWT_SECRET matches between environments
- Check token expiration time
- Ensure proper cookie settings for cross-origin requests

#### CORS Errors

**Issue**: Cross-origin request blocked

```javascript
// Browser console error:
// Access to fetch at 'https://api.example.com' from origin 'https://app.example.com'
// has been blocked by CORS policy
```

**Solutions**:

- Add frontend URL to CORS_ORIGINS environment variable
- Verify credentials: 'include' in fetch requests
- Check preflight request handling

#### Database Connection Issues

**Issue**: MongoDB connection timeout

```bash
# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_MONGO_URL')
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
"
```

**Solutions**:

- Verify MongoDB URL format and credentials
- Check network access rules (MongoDB Atlas)
- Ensure database exists and user has permissions

#### Deployment Issues

**Issue**: Environment variables not loading

```bash
# Check environment in deployed app
curl https://your-app.onrender.com/api/health
```

**Solutions**:

- Verify all environment variables are set in deployment platform
- Check for typos in variable names
- Ensure proper quote handling for complex values

### Debug Mode

#### Backend Debugging

```javascript
// Enable debug mode
process.env.DEBUG = "app:*";

// Add debug logging
const debug = require("debug")("app:api");
debug("Processing request:", req.path);
```

#### Frontend Debugging

```javascript
// Enable React Query devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </>
  );
}
```

### Performance Issues

#### Slow API Responses

1. Check database query performance
2. Review index usage
3. Monitor network latency
4. Analyze payload sizes

#### High Memory Usage

1. Check for memory leaks in event listeners
2. Review database connection pooling
3. Monitor garbage collection
4. Analyze bundle sizes

---

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Support and Contributing

### Getting Help

For technical support and questions:

- Review this documentation thoroughly
- Check the troubleshooting section
- Search existing issues in the repository
- Create a new issue with detailed information

### Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style and conventions
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request with clear description

### Development Standards

- Follow existing code structure and naming conventions
- Write comprehensive tests for new features
- Update API documentation for endpoint changes
- Maintain backward compatibility when possible
- Use semantic versioning for releases

---

_This documentation is maintained alongside the codebase. For the most current information, please refer to the source code and inline comments._

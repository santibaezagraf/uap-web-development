# API Documentation - Todo App Backend

## Base URL
```
http://localhost:3001/api
```

## Authentication
The API uses **JWT tokens in HTTP-only cookies** for authentication. All protected routes require the user to be authenticated.

## Quick Reference

### Endpoints Summary

| Method | Endpoint | Auth | Permission | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/auth/register` | ❌ | - | Register new user |
| `POST` | `/auth/login` | ❌ | - | Login user |
| `POST` | `/auth/logout` | ❌ | - | Logout user |
| `GET` | `/auth/me` | ✅ | - | Get current user |
| `GET` | `/auth/users` | ✅ | - | Get all users |
| `GET` | `/auth/settings` | ✅ | - | Get user settings |
| `PUT` | `/auth/settings` | ✅ | - | Update user settings |
| `GET` | `/auth/boards` | ✅ | - | Get accessible boards |
| `GET` | `/boards` | ✅ | - | Get owned boards |
| `GET` | `/boards/accessible` | ✅ | - | Get all accessible boards |
| `POST` | `/boards` | ✅ | - | Create new board |
| `GET` | `/boards/:id` | ✅ | 👁️ View | Get board by ID |
| `PUT` | `/boards/:id` | ✅ | ✏️ Edit | Update board |
| `DELETE` | `/boards/:id` | ✅ | 👑 Owner | Delete board |
| `POST` | `/boards/:id/share` | ✅ | 👑 Owner | Share board |
| `GET` | `/boards/:id/permissions` | ✅ | 👁️ View | Get board permissions |
| `PUT` | `/boards/:id/permissions/:userId` | ✅ | 👑 Owner | Update permission |
| `DELETE` | `/boards/:id/permissions/:userId` | ✅ | 👑 Owner | Remove permission |
| `GET` | `/boards/:id/todos` | ✅ | 👁️ View | Get todos |
| `POST` | `/boards/:id/todos` | ✅ | ✏️ Edit | Create todo |
| `GET` | `/boards/:id/todos/:todoId` | ✅ | 👁️ View | Get todo by ID |
| `PUT` | `/boards/:id/todos/:todoId` | ✅ | ✏️ Edit | Update todo |
| `PATCH` | `/boards/:id/todos/:todoId/toggle` | ✅ | ✏️ Edit | Toggle todo |
| `DELETE` | `/boards/:id/todos/:todoId` | ✅ | ✏️ Edit | Delete todo |
| `DELETE` | `/boards/:id/todos/clear-completed` | ✅ | ✏️ Edit | Clear completed |

### Permission Levels
- 👁️ **Viewer**: Can view board and todos
- ✏️ **Editor**: Can view and modify todos
- 👑 **Owner**: Full control (edit, delete, share board)

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request:**
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

**Validation Rules:**
- `username`: 3-20 characters, alphanumeric + underscore only
- `email`: Valid email format
- `password`: Min 6 chars, must contain uppercase, lowercase, and numbers

**Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### Login User
```http
POST /api/auth/login
```

**Request:**
```json
{
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

**Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
    }
}
```

### Logout User
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
    "message": "Logout successful"
}
```

### Get Current User
```http
GET /api/auth/me
```
*Requires authentication*

**Response (200):**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Get All Users
```http
GET /api/auth/users
```
*Requires authentication*

**Response (200):**
```json
[
    {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
    },
    {
        "id": 2,
        "username": "janedoe",
        "email": "jane@example.com"
    }
]
```

### Get User Settings
```http
GET /api/auth/settings
```
*Requires authentication*

**Response (200):**
```json
{
    "refresh_interval": 5000,
    "uppercase_descriptions": false,
    "todos_per_page": 10
}
```

### Update User Settings
```http
PUT /api/auth/settings
```
*Requires authentication*

**Request:**
```json
{
    "refresh_interval": 3000,
    "uppercase_descriptions": true,
    "todos_per_page": 15
}
```

**Validation Rules:**
- `refresh_interval`: 1000-300000 ms
- `uppercase_descriptions`: boolean
- `todos_per_page`: 1-100

**Response (200):**
```json
{
    "message": "Settings updated successfully",
    "settings": {
        "refresh_interval": 3000,
        "uppercase_descriptions": true,
        "todos_per_page": 15
    }
}
```

---

## Board Endpoints

### Get Owned Boards
```http
GET /api/boards
```
*Requires authentication*

Returns only boards owned by the current user.

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "My Personal Board",
        "owner_id": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
    }
]
```

### Get Accessible Boards
```http
GET /api/boards/accessible
```
*Requires authentication*

Returns all boards accessible to the user (owned + shared).

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "My Personal Board",
        "created_at": "2024-01-01T00:00:00.000Z",
        "user_permission": "owner",
        "owner": {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com"
        }
    },
    {
        "id": 2,
        "name": "Shared Project",
        "created_at": "2024-01-02T00:00:00.000Z",
        "user_permission": "editor",
        "owner": {
            "id": 2,
            "username": "janedoe",
            "email": "jane@example.com"
        }
    }
]
```

### Create Board
```http
POST /api/boards
```
*Requires authentication*

**Request:**
```json
{
    "name": "New Project Board"
}
```

**Validation Rules:**
- `name`: 1-100 characters, required

**Response (201):**
```json
{
    "id": 3,
    "name": "New Project Board",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Get Board by ID
```http
GET /api/boards/:boardId
```
*Requires authentication + view permission*

**Response (200):**
```json
{
    "id": 1,
    "name": "My Board",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Board
```http
PUT /api/boards/:boardId
```
*Requires authentication + edit permission*

**Request:**
```json
{
    "name": "Updated Board Name"
}
```

**Response (200):**
```json
{
    "id": 1,
    "name": "Updated Board Name",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Delete Board
```http
DELETE /api/boards/:boardId
```
*Requires authentication + owner permission*

**Response (200):**
```json
{
    "message": "Board deleted successfully"
}
```

---

## Board Sharing Endpoints

### Share Board
```http
POST /api/boards/:boardId/share
```
*Requires authentication + owner permission*

**Request:**
```json
{
    "email": "user@example.com",
    "permission_level": "editor"
}
```

**Validation Rules:**
- `email`: Valid email of existing user
- `permission_level`: "editor" or "viewer"

**Response (201):**
```json
{
    "message": "Board shared successfully",
    "permission": {
        "id": 1,
        "board_id": 1,
        "user_id": 2,
        "permission_level": "editor",
        "granted_by": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

### Get Board Permissions
```http
GET /api/boards/:boardId/permissions
```
*Requires authentication + view permission*

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 2,
        "username": "janedoe",
        "email": "jane@example.com",
        "permission_level": "editor",
        "granted_at": "2024-01-01T00:00:00.000Z"
    }
]
```

### Update User Permission
```http
PUT /api/boards/:boardId/permissions/:userId
```
*Requires authentication + owner permission*

**Request:**
```json
{
    "permission_level": "viewer"
}
```

**Response (200):**
```json
{
    "message": "Permission updated successfully"
}
```

### Remove User Permission
```http
DELETE /api/boards/:boardId/permissions/:userId
```
*Requires authentication + owner permission*

**Response (200):**
```json
{
    "message": "Permission removed successfully"
}
```

---

## Todo Endpoints

### Get Todos
```http
GET /api/boards/:boardId/todos
```
*Requires authentication + view permission*

**Query Parameters:**
- `filter`: `all` | `completed` | `uncompleted` (default: `all`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search term (max: 100 chars)

**Example:**
```http
GET /api/boards/1/todos?filter=uncompleted&page=1&limit=5&search=project
```

**Response (200):**
```json
{
    "todos": [
        {
            "id": 1,
            "text": "Complete project documentation",
            "completed": false,
            "board_id": 1,
            "created_at": "2024-01-01T00:00:00.000Z"
        },
        {
            "id": 2,
            "text": "Review code changes",
            "completed": true,
            "board_id": 1,
            "created_at": "2024-01-01T01:00:00.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 5,
        "totalItems": 25,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
    }
}
```

### Create Todo
```http
POST /api/boards/:boardId/todos
```
*Requires authentication + edit permission*

**Request:**
```json
{
    "text": "New task description"
}
```

**Validation Rules:**
- `text`: 1-500 characters, required

**Response (201):**
```json
{
    "id": 3,
    "text": "New task description",
    "completed": false,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Get Todo by ID
```http
GET /api/boards/:boardId/todos/:todoId
```
*Requires authentication + view permission*

**Response (200):**
```json
{
    "id": 1,
    "text": "Complete project documentation",
    "completed": false,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Todo
```http
PUT /api/boards/:boardId/todos/:todoId
```
*Requires authentication + edit permission*

**Request:**
```json
{
    "text": "Updated task description"
}
```

**Response (200):**
```json
{
    "id": 1,
    "text": "Updated task description",
    "completed": false,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Toggle Todo Completion
```http
PATCH /api/boards/:boardId/todos/:todoId/toggle
```
*Requires authentication + edit permission*

**Response (200):**
```json
{
    "id": 1,
    "text": "Complete project documentation",
    "completed": true,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Delete Todo
```http
DELETE /api/boards/:boardId/todos/:todoId
```
*Requires authentication + edit permission*

**Response (200):**
```json
{
    "message": "Todo deleted successfully"
}
```

### Clear Completed Todos
```http
DELETE /api/boards/:boardId/todos/clear-completed
```
*Requires authentication + edit permission*

**Response (200):**
```json
{
    "message": "Completed todos cleared",
    "deletedCount": 5
}
```

---

## Error Responses

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |

### Error Response Format

**Validation Error (422):**
```json
{
    "error": "Validation failed",
    "details": [
        {
            "field": "email",
            "message": "Must be a valid email"
        },
        {
            "field": "password",
            "message": "Password must contain uppercase, lowercase, and numbers"
        }
    ]
}
```

**Authentication Error (401):**
```json
{
    "error": "Authentication required"
}
```

**Permission Error (403):**
```json
{
    "error": "Insufficient permissions for this action"
}
```

**Not Found Error (404):**
```json
{
    "error": "Board not found"
}
```

**Conflict Error (409):**
```json
{
    "error": "Email already registered"
}
```

---

## Testing with cURL

### Register and Login
```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get current user (using saved cookies)
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt
```

### Working with Boards
```bash
# Create a board
curl -X POST http://localhost:3001/api/boards \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"My Test Board"}'

# Get accessible boards
curl -X GET http://localhost:3001/api/boards/accessible \
  -b cookies.txt

# Create a todo (replace :boardId with actual ID)
curl -X POST http://localhost:3001/api/boards/1/todos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"text":"Test todo item"}'

# Get todos with filters
curl -X GET "http://localhost:3001/api/boards/1/todos?filter=all&page=1&limit=10" \
  -b cookies.txt
```

### Sharing Boards
```bash
# Share a board (requires owner permission)
curl -X POST http://localhost:3001/api/boards/1/share \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"email":"friend@example.com","permission_level":"editor"}'

# Get board permissions
curl -X GET http://localhost:3001/api/boards/1/permissions \
  -b cookies.txt
```

---

## Postman Collection

You can import this Postman collection to test the API endpoints:

```json
{
    "info": {
        "name": "Todo App API",
        "description": "Complete API collection for the Todo App"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:3001/api"
        }
    ],
    "item": [
        {
            "name": "Auth",
            "item": [
                {
                    "name": "Register",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/auth/register",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"testuser\",\n    \"email\": \"test@example.com\",\n    \"password\": \"Test123!\"\n}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                },
                {
                    "name": "Login",
                    "request": {
                        "method": "POST",
                        "url": "{{base_url}}/auth/login",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"Test123!\"\n}",
                            "options": {
                                "raw": {
                                    "language": "json"
                                }
                            }
                        }
                    }
                }
            ]
        }
    ]
}
```

Copy this JSON and import it into Postman for a complete testing environment.

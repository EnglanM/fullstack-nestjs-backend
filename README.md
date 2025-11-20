# NestJS Microservices Backend

A production-ready NestJS monorepo backend application implementing a microservices architecture with user authentication. The project uses TCP-based microservices communication, MongoDB for data persistence, and Docker for containerization.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Docker](#docker)
- [Development](#development)

## ✨ Features

- **Microservices Architecture**: Gateway and Authentication services communicating via TCP
- **User Management**: User registration and authentication
- **Password Security**: Bcrypt password hashing
- **Input Validation**: DTO validation using class-validator
- **API Documentation**: Swagger/OpenAPI integration
- **Error Handling**: Centralized exception handling with custom filters
- **Docker Support**: Full containerization with docker-compose
- **Database Persistence**: MongoDB with persistent volumes
- **Type Safety**: Full TypeScript support

## 🏗️ Architecture

The application follows a microservices architecture pattern:

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────────────┐
│      Gateway Service            │
│  (HTTP Server - Port 3000)      │
│  - Receives HTTP requests       │
│  - Validates DTOs               │
│  - Swagger documentation        │
└──────┬──────────────────────────┘
       │ TCP (Microservice)
       ▼
┌─────────────────────────────────┐
│  Authentication Service         │
│  (TCP Microservice - Port 3001) │
│  - Business logic               │
│  - Database operations          │
│  - User management              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      MongoDB                    │
│  (Port 27017)                   │
│  - User data storage            │
└─────────────────────────────────┘
```

### Communication Flow

1. **HTTP Request** → Gateway receives HTTP requests from clients
2. **Validation** → Gateway validates request DTOs using class-validator
3. **TCP Communication** → Gateway sends messages to Authentication service via TCP
4. **Business Logic** → Authentication service processes the request
5. **Database** → Authentication service interacts with MongoDB
6. **Response** → Response flows back through the same path

## 📁 Project Structure

```
fullstack-nestjs-backend/
├── apps/
│   ├── gateway/                 # HTTP Gateway Service
│   │   ├── src/
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.service.ts
│   │   │   ├── gateway.module.ts
│   │   │   └── main.ts
│   │   └── test/
│   └── authentication/          # Authentication Microservice
│       ├── src/
│       │   ├── authentication.controller.ts
│       │   ├── authentication.service.ts
│       │   ├── authentication.module.ts
│       │   ├── main.ts
│       │   └── users/
│       │       ├── user.schema.ts
│       │       └── user.repository.ts
│       └── test/
├── common/                      # Shared code across services
│   ├── dtos/                    # Data Transfer Objects
│   │   ├── register-user.dto.ts
│   │   └── sign-in-user.dto.ts
│   ├── rtos/                    # Response Transfer Objects
│   │   └── user-response.rto.ts
│   ├── exceptions/              # Custom exceptions and filters
│   │   ├── business.exception.ts
│   │   └── http-exception.filter.ts
│   └── interceptors/            # Shared interceptors
│       └── rpc-exception-interceptor.ts
├── config/                      # Configuration files
│   └── microservices.config.ts
├── core/                        # Core utilities and base classes
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile.gateway           # Gateway Dockerfile
├── Dockerfile.authentication    # Authentication Dockerfile
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🔧 Prerequisites

- **Node.js**: v23.6.1 (use `.nvmrc` file)
- **npm**: Latest version
- **Docker** & **Docker Compose**: For containerized deployment
- **MongoDB**: Either local installation or via Docker

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd fullstack-nestjs-backend
```

### 2. Install Node.js version

If using nvm (Node Version Manager):

```bash
nvm use
```

Or install Node.js v23.6.1 manually.

### 3. Install dependencies

```bash
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_URI=mongodb://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@localhost:27017/authentication?authSource=admin

# Gateway Configuration
PORT=3000

# Authentication Microservice Configuration
AUTH_HOST=localhost
AUTH_TCP_PORT=3001
```

### Environment Variables for Docker

When using Docker Compose, the following environment variables are used:

- `MONGODB_USERNAME`: MongoDB root username 
- `MONGODB_PASSWORD`: MongoDB root password 
- `PORT`: Gateway HTTP port (default: 3000)
- `AUTH_HOST`: Authentication service host (default: localhost)
- `AUTH_TCP_PORT`: Authentication service TCP port (default: 3001)

## 🚀 Running the Application

### Option 1: Local Development (Without Docker)

#### 1. Start MongoDB

Use Docker to run only MongoDB:

```bash
docker-compose up mongo -d
```

#### 2. Start Authentication Service

```bash
nest start authentication --watch
```

The service will start on TCP port 3001.

#### 3. Start Gateway Service

In a new terminal:

```bash
nest start gateway --watch
```

The gateway will start on HTTP port 3000.

### Option 2: Docker Compose (Recommended)

Run all services with Docker:

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### Available Scripts

```bash
# Build all applications
npm run build

# Build specific application
nest build gateway
nest build authentication

# Development mode (watch mode) - starts default project (gateway)
npm run start:dev

# Start specific service in development mode
nest start gateway --watch
nest start authentication --watch

# Production mode (requires building first)
npm run build
node dist/apps/gateway/main.js
node dist/apps/authentication/main.js

# Linting
npm run lint

# Format code
npm run format
```

## 📚 API Documentation

Once the gateway is running, access the Swagger documentation at:

**http://localhost:3000/api**

### API Endpoints

#### Authentication Endpoints

##### 1. Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123!"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

##### 2. Sign In

```http
POST /auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

##### 3. Get All Users

```http
GET /auth/users
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

##### 4. Test Endpoint

```http
GET /auth/test
```

**Response (200 OK):**
```json
{
  "error": false,
  "data": "hello world"
}
```

### Validation Rules

- **Email**: Must be a valid email format
- **Name**: Required, must be a string
- **Password**: Required, minimum 8 characters

## 🛡️ Error Handling

The application implements a comprehensive error handling strategy:

### Error Flow

1. **Service Layer**: Throws NestJS HTTP exceptions (`ConflictException`, `UnauthorizedException`, etc.)
2. **RPC Interceptor**: Converts HTTP exceptions to RPC exceptions for microservice communication
3. **Gateway Service**: Converts RPC exceptions back to HTTP exceptions
4. **Global Exception Filter**: Formats all exceptions into consistent HTTP responses

### Error Response Format

```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/register"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or bad request
- `401 Unauthorized`: Invalid credentials
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Server error

<!-- ## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Debug tests
npm run test:debug
``` -->

## 🐳 Docker

### Docker Services

The `docker-compose.yml` defines three services:

1. **mongo**: MongoDB database with persistent volumes
2. **authentication**: Authentication microservice (TCP)
3. **gateway**: API Gateway (HTTP)

### Docker Volumes

MongoDB data is persisted using Docker volumes:
- `mongo_data`: Database files
- `mongo_config`: MongoDB configuration

Data persists across container restarts. To reset the database:

```bash
docker-compose down -v
```

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Execute command in container
docker-compose exec [service-name] [command]

# Remove all containers and volumes
docker-compose down -v
```

## 💻 Development

### Adding New Features

1. **DTOs**: Add to `common/dtos/`
2. **RTOs**: Add to `common/rtos/`
3. **Exceptions**: Add to `common/exceptions/`
4. **Services**: Add to respective app's service file
5. **Controllers**: Add endpoints to respective controller

### Microservice Communication

To add new microservice commands:

1. Add `@MessagePattern` in Authentication Controller
2. Implement method in Authentication Service
3. Add method in Gateway Service to call the microservice
4. Add endpoint in Gateway Controller

Example:

```typescript
// Authentication Controller
@MessagePattern({ cmd: 'new_command' })
async newCommand(@Payload() data: any) {
  return await this.authenticationService.newMethod(data);
}

// Gateway Service
async newMethod(data: any) {
  const response = await firstValueFrom(
    this.authClient.send({ cmd: 'new_command' }, data),
  );
  return response.data;
}

// Gateway Controller
@Post('new-endpoint')
async newEndpoint(@Body() dto: SomeDto) {
  return this.gatewayService.newMethod(dto);
}
```

## 🔍 Troubleshooting

### Port Already in Use

If you get a port already in use error:

```bash
# Find process using port (macOS/Linux)
lsof -i :3000  # Gateway
lsof -i :3001  # Authentication
lsof -i :27017 # MongoDB

# Kill process
kill -9 <PID>

# Alternative (macOS/Linux)
kill $(lsof -t -i:3000)  # Gateway
kill $(lsof -t -i:3001)  # Authentication
kill $(lsof -t -i:27017) # MongoDB
```

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB credentials
- Check network connectivity in Docker

### Microservice Communication Issues

- Ensure Authentication service is running before Gateway
- Check `AUTH_HOST` and `AUTH_TCP_PORT` environment variables in `.env` file
- Verify TCP port is not blocked by firewall
- When running in Docker, use service names (e.g., `authentication`) instead of `localhost` for `AUTH_HOST`

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up

# Check container logs
docker-compose logs [service-name]

# Check container status
docker-compose ps
```


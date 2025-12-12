# CourseCompass Backend - Multi-AI Agent System

> **Intelligent Backend API with Vector Search, AI Agents, and Real-time Course Intelligence**

A sophisticated backend system powered by multiple AI agents that intelligently routes queries, performs semantic search, and provides course recommendations and schedule generation for academic planning.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?logo=prisma&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC143C)
![Groq](https://img.shields.io/badge/Groq-LLM-FF6B6B)

---

## Features

### AI-Powered Intelligence
- **Multi-Agent Architecture** - Specialized agents for course details and scheduling
- **Query Classification** - LLM-based routing to appropriate domain experts
- **Vector Search** - Semantic search using Qdrant and Jina AI embeddings
- **Schedule Generation** - Intelligent conflict-free schedule creation
- **Prerequisite Analysis** - Deep understanding of course dependencies

### Authentication & Security
- **JWT Authentication** - Secure token-based auth with HttpOnly support
- **Password Hashing** - bcrypt encryption for user credentials
- **Route Protection** - Middleware-based authorization
- **CORS Configuration** - Secure cross-origin resource sharing

### Data Management
- **Prisma ORM** - Type-safe database queries
- **MySQL Database** - Relational data storage
- **Redis Caching** - Session management and caching
- **Vector Database** - Qdrant for semantic search

### Course Intelligence
- **Course Detail Agent** - Handles course information and recommendations
- **Schedule Agent** - Manages class scheduling and conflict detection
- **Router Agent** - Classifies and routes queries intelligently
- **Knowledge Base** - 58 course details + 76 schedule entries

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Docker** (for containerized services)
- **npm** or **yarn**

### Required Services

This backend requires the following services:
1. **MySQL** - User data and authentication
2. **Redis** - Caching and session management
3. **Qdrant** - Vector database for semantic search
4. **Jina AI** - Text embedding service
5. **Groq** - LLM inference

---

## Installation & Setup

### 1. Clone and Install

```bash
git clone https://github.com/DhruvilJayani/coursecompass.git
cd Archive
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="mysql://root:password@localhost:3306/coursecompass"

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Groq API (LLM)
GROQ_API_KEY=your-groq-api-key

# Jina AI (Embeddings)
JINA_API_KEY=your-jina-api-key
```

### 3. Start Required Services

#### Option A: Using Docker (Recommended)

```bash
# Start MySQL
docker run -d \
  --name coursecompass-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=coursecompass \
  -p 3306:3306 \
  mysql:8.0

# Start Redis
docker run -d \
  --name coursecompass-redis \
  -p 6379:6379 \
  redis:latest

# Start Qdrant
docker run -d \
  --name coursecompass-qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  qdrant/qdrant:latest
```

#### Option B: Manual Installation

Install and configure each service manually. Refer to their official documentation:
- [MySQL Installation](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/)
- [Redis Installation](https://redis.io/docs/getting-started/)
- [Qdrant Installation](https://qdrant.tech/documentation/quick-start/)

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 5. Seed the Database

Populate Qdrant with course data:

```bash
node scripts/seed.js
```

This will:
- Create `CourseDetails` collection (58 courses)
- Create `CourseSchedule` collection (76 schedule entries)
- Generate and store vector embeddings

### 6. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:3000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:reset` | Reset database (WARNING: deletes all data) |

---

##  Project Structure

```
Archive/
├── agents/                    # AI Agent implementations
│   ├── courseRouter.agent.js # Main query router
│   ├── courseDetail.agent.js # Course information agent
│   └── courseScheduler.agent.js # Scheduling agent
├── controllers/               # Route controllers
│   ├── authController.js     # Authentication logic
│   └── chatController.js     # Chat endpoint handler
├── middlewares/              # Express middlewares
│   └── authMiddleware.js     # JWT verification
├── routes/                   # API routes
│   ├── authRoutes.js        # Auth endpoints
│   ├── chatRoutes.js        # Chat endpoints
│   └── index.js             # Route aggregator
├── services/                # External service integrations
│   ├── groq.js             # Groq LLM client
│   ├── jina.js             # Jina embeddings
│   ├── qdrant.js           # Qdrant vector DB
│   └── redis.js            # Redis cache
├── exceptions/              # Custom error classes
│   └── *.js
├── scripts/                # Utility scripts
│   └── seed.js            # Database seeding
├── prisma/                # Prisma ORM files
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration files
├── error-handler.js       # Global error handler
├── index.js              # Application entry point
└── package.json
```

---

## Tech Stack

### Core Framework
- **Node.js 20+** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **Prisma 6.13.0** - ORM for MySQL

### AI & ML Services
- **Groq SDK 0.33.0** - LLM inference (Llama 3.3 70B)
- **Jina AI** - Text embedding generation (1024-dimensional vectors)
- **Qdrant Client 1.15.1** - Vector database operations

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** - Token-based auth
- **bcrypt 6.0.0** - Password hashing
- **cors 2.8.5** - CORS middleware

### Database & Caching
- **MySQL** - Primary relational database
- **Redis (ioredis 5.8.0)** - Caching and sessions
- **Qdrant** - Vector database for embeddings

### Utilities
- **Axios 1.12.2** - HTTP client
- **dotenv 17.2.1** - Environment variables
- **Zod 4.0.17** - Schema validation
- **nodemon 3.1.10** - Development auto-reload

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

#### Register Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNo": "4081234567"
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chat/chatUser` | Send chat message |  |

#### Chat Request
```json
{
  "message": "What are the prerequisites for CMPE 280?"
}
```

#### Chat Response
```json
{
  "message": "The prerequisites for CMPE 280 - Web UI Design and Development are CMPE 202.",
  "from_knowledge_base": true,
  "source": "courseDetail"
}
```

### Authentication Header
All protected endpoints require:
```
auth-token: <JWT_TOKEN>
```

---

## 🤖 AI Agent Architecture

### Query Flow

```
User Query
    ↓
Router Agent (LLM Classification)
    ↓
    ├─→ courseDetail Agent
    │   ├─→ Jina AI (Generate Embedding)
    │   ├─→ Qdrant (Vector Search on CourseDetails)
    │   └─→ Groq LLM (Generate Response)
    │
    └─→ courseScheduler Agent
        ├─→ Jina AI (Generate Embedding)
        ├─→ Qdrant (Vector Search on CourseSchedule)
        ├─→ Conflict Detection Algorithm
        └─→ Groq LLM (Generate Schedule)
```

### Agent Details

#### 1. Router Agent (`courseRouter.agent.js`)
- **Purpose**: Classify incoming queries
- **Domains**: `courseDetail`, `courseScheduler`, `unknown`
- **Model**: Llama 3.3 70B
- **Strategy**: Zero-shot classification with system prompts

#### 2. Course Detail Agent (`courseDetail.agent.js`)
- **Purpose**: Answer course information queries
- **Capabilities**: 
  - Course descriptions
  - Prerequisites
  - Recommendations based on interests
  - Course comparisons
- **Vector Search**: CourseDetails collection
- **Fields**: code, title, description, units, prerequisites

#### 3. Course Scheduler Agent (`courseScheduler.agent.js`)
- **Purpose**: Handle scheduling queries
- **Capabilities**:
  - Show class schedules
  - Generate conflict-free schedules
  - Detect time conflicts
  - Filter by instructors, terms, times
- **Vector Search**: CourseSchedule collection
- **Fields**: code, term, section, days, time, location, instructor

---

## Testing the API

### Using cURL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# Send chat message
curl -X POST http://localhost:3000/api/chat/chatUser \
  -H "Content-Type: application/json" \
  -H "auth-token: $TOKEN" \
  -d '{
    "message": "What are the prerequisites for CMPE 280?"
  }' | jq
```

### Sample Queries

**Course Detail Queries:**
- "What are the prerequisites for CMPE 258?"
- "I'm interested in AI and machine learning. Which courses should I take?"
- "Tell me about cloud computing courses"
- "Compare CMPE 257 and CMPE 258"

**Schedule Queries:**
- "When is CMPE 202 offered?"
- "Who teaches CMPE 272?"
- "Show me all evening classes in Fall 2024"
- "Generate a schedule for CMPE 202, CMPE 272, and CMPE 280"


---

## Database Schema

### User Table (Prisma)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  phoneNo   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Qdrant Collections

**CourseDetails** (58 points)
- Vector Size: 1024
- Distance: Cosine
- Fields: id, code, title, units, description, prerequisites, ge

**CourseSchedule** (76 points)
- Vector Size: 1024
- Distance: Cosine
- Fields: id, code, term, section, days, time, location, instructor, note

---

## AI Tool Usage Disclosure

This project extensively utilized AI-powered development tools:

### Tools Used
- **Google Gemini AI (via Antigravity)** - Architecture design, code generation, debugging
- **GitHub Copilot** - Code completion and boilerplate generation
- **ChatGPT** - Documentation and algorithm design

### AI Contribution Areas
1. **Agent Architecture** - AI-assisted multi-agent system design
2. **Vector Search Implementation** - Qdrant integration patterns
3. **Schedule Algorithm** - Conflict detection and generation logic
4. **Error Handling** - Exception classes and middleware
5. **API Design** - RESTful endpoint structure
6. **Database Schema** - Prisma model design
7. **Seed Data** - Course catalog generation
8. **LLM Prompt Engineering** - Optimized system prompts for agents

### Human Contributions
- Overall system architecture and requirements
- Business logic and feature specifications
- API endpoint design and integration
- Testing and validation
- Database optimization
- Deployment configuration
- Security implementation
- Final code review and refactoring

**Disclosure**: AI tools were used as intelligent assistants to accelerate development. All generated code has been thoroughly reviewed, tested, and validated by human developers. The AI served to enhance productivity and code quality, not replace human expertise in system design and implementation.

---

## Troubleshooting

### Qdrant Connection Issues
```bash
# Check if Qdrant is running
curl http://localhost:6333/collections

# Restart Qdrant
docker restart coursecompass-qdrant
```

### MySQL Connection Issues
```bash
# Check MySQL status
docker ps | grep mysql

# Check connection
mysql -u root -p -h localhost -P 3306
```

### Prisma Issues
```bash
# Regenerate client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npm run prisma:reset
```

---

## Performance

- **Query Classification**: ~200-500ms
- **Vector Search**: ~50-150ms (for 134 total vectors)
- **LLM Response**: ~1-3 seconds (depending on Groq API)
- **Total Response Time**: ~2-4 seconds end-to-end

---


## Acknowledgments

- San José State University - CMPE 280 Course Project
- Groq for fast LLM inference
- Jina AI for embedding generation
- Qdrant team for vector database
- Prisma team for excellent ORM



---

**Built with ⚡ by SJSU Students**

# Minimal AI Customer Support Agent

A minimal full-stack AI-powered customer support chat application with JWT authentication, MongoDB storage, and AI integration via OpenRouter.ai or Hugging Face.

## Features

*   **User Authentication:** Secure signup, login, and logout using JWT.
*   **Secure Passwords:** Passwords are hashed with bcrypt.
*   **Protected API Routes:** All chat functionality is protected and requires a valid JWT.
*   **AI Integration:** The chat system provides AI-generated responses.
*   **Persistent Chat History:** User-scoped conversations are stored in MongoDB.
*   **Conversation Management:** Easily view past conversations.
*   **Optional Enhancements:** Includes support for a typing indicator, rate limiting, and environment switching.

## Tech Stack

| Layer          | Technology               |
| :------------- | :----------------------- |
| Frontend       | React (Vite or CRA)      |
| Backend        | Node.js + Express        |
| Database       | MongoDB Atlas (Free tier)|
| Authentication | JWT + Bcrypt             |
| AI             | OpenRouter.ai / Hugging Face |
| Hosting        | Vercel / Netlify / Render / Railway |

## API Routes

| Method | Endpoint        | Description                                |
| :----- | :-------------- | :----------------------------------------- |
| `POST`   | `/auth/signup`    | Signs up a new user.                       |
| `POST`   | `/auth/login`     | Logs in a user.                            |
| `POST`   | `/chat/send`      | Sends a message to the AI and returns the response. |
| `GET`    | `/chat/history`   | Retrieves the user's chat history.         |

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/ancypeter2k/ai-customer-support-agent.git
cd project-root
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Environment Variables

Create a `.env` file in the `server` directory. This project uses `dotenv` to load environment variables. Example `.env` contents:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
AI_PROVIDER=openrouter
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=gpt2
```

#### Start Server

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../chatbot
npm install
```

#### Environment Variables

Create a `.env` file in the `chatbot` directory. Example `.env` contents:

```
VITE_API_URL=http://localhost:5000
```

#### Start Frontend

```bash
npm run dev
```

### 4. Docker Setup

A `docker-compose.yml` file is included in the project root to run both the frontend and backend in separate containers.

```yaml
services:
  mongo:
    image: mongo:6.0
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  server:
    build: ./server
    restart: unless-stopped
    env_file:
      - ./server/.env
    ports:
      - "5000:5000"
    depends_on:
      - mongo

  chatbot:
    build: ./chatbot
    restart: unless-stopped
    env_file:
      - ./chatbot/.env
    ports:
      - "3000:3000"
    depends_on:
      - server

volumes:
  mongo_data:
```

To run the application with Docker:

```bash
docker compose up --build
```

### 5. Deployment

*   **Live Demo:** [AI Customer Support Agent](https://ai-customer-support-agent-5o9wtm12a-ancy-peters-projects.vercel.app)
*   **Frontend:** Deploy to platforms like Vercel or Netlify.
*   **Backend:** Deploy to services like Render or Railway.

**Note:** Be sure to set all your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `HUGGINGFACE_API_KEY`, `VITE_API_URL`) on your chosen hosting platform for production.

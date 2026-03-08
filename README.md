<a name="readme-top"></a>

# VizorLite

<div align="center">
  <img src="docs/cover.png" alt="VizorLite Cover" width="800">
  
  [English](#en) | [Русский](#ru)
</div>

---

## English Version <a name="en"></a>

VizorLite is a modern video conferencing web application that allows users to easily create and join video meetings without the need for additional software installation or registration. The platform focuses on simplicity, accessibility, and privacy.

### 📖 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

### ✨ Key Features

#### Core Functionality
- **🎥 Video Meetings**: Create and join video conferences instantly
- **🔗 Easy Join**: Join meetings via unique link or room ID
- **👥 Multi-participant**: Support for up to 10 participants per room (configurable)
- **🔐 Secure Authentication**: JWT-based authentication system
- **👤 User Profiles**: Profile management with avatar upload

#### Real-time Communication
- **📡 WebRTC**: Peer-to-peer video/audio connections
- **🔌 WebSocket**: Socket.IO for signaling and real-time events
- **🖥️ Screen Sharing**: Share your screen with participants
- **🎤 Media Controls**: Toggle camera and microphone

#### AI & Internationalization
- **🤖 AI Assistant "Marcus"**: Context-aware chatbot for platform support
- **🌍 Multi-language**: 7 languages (EN, RU, DE, JP, CN, FR, AR)
- **📱 PWA**: Install as a Progressive Web App

#### User Experience
- **🎨 Modern UI**: Ant Design components
- **📱 Responsive**: Mobile and desktop support
- **⚡ Fast**: Vite bundler with lazy loading
- **🔔 Notifications**: User-friendly action feedback

### 🛠️ Tech Stack

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 | Runtime platform |
| Express.js | 5.2.1 | Web framework |
| MongoDB | 7 | Database |
| Mongoose | 9.1.2 | MongoDB ODM |
| Socket.IO | 4.8.3 | WebSocket server |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password hashing |
| sharp | 0.34.5 | Image processing |
| multer | 2.1.0 | File uploads |

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool |
| React Router | 7.11.0 | Routing |
| Zustand | 5.0.9 | State management |
| React Intl | 8.0.11 | i18n |
| Ant Design | 6.1.4 | UI components |
| TanStack Query | 5.90.20 | Server state |
| Socket.IO Client | 4.8.3 | WebSocket client |
| simple-peer | 9.11.1 | WebRTC wrapper |

#### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Web server |
| GitHub Actions | CI/CD |
| PM2 | Process manager |

### 🏗️ Architecture

#### System Overview
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│   MongoDB   │
│  (React TS) │◀────│ (Express.js) │◀────│  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │   WebSocket        │
       └───────────────────▶│
       │   (Socket.IO)      │
       │                    │
       └────────────────────┘
           WebRTC P2P
```

#### Backend Architecture
```
backend/
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, logging
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── services/        # Business logic (WebSocket)
├── utils/           # Helper functions (JWT, logger)
└── index.js         # Entry point
```

#### Frontend Architecture (FSD-inspired)
```
frontend/src/
├── app/             # Application initialization
│   ├── layout/      # Layout components
│   ├── providers/   # Context providers
│   └── router/      # Route configuration
├── entities/        # Business entities
│   ├── user/        # User entity
│   ├── room/        # Room entity
│   ├── ai/          # AI entity
│   └── locale/      # i18n entity
├── features/        # User actions
│   ├── auth/        # Authentication
│   ├── aiHelper/    # AI chat
│   └── roomBoard/   # Meeting controls
├── pages/           # Page components
├── widgets/         # Composite components
└── shared/          # Reusable code
    ├── api/         # API clients
    ├── ui/          # UI components
    └── assets/      # Static files
```

### 📡 API Reference

#### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

#### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update user profile | ✅ |
| DELETE | `/auth/account` | Delete user account | ✅ |

#### Profile Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/profile/avatar` | Upload avatar | ✅ |
| DELETE | `/profile/avatar` | Delete avatar | ✅ |
| GET | `/profile/avatar` | Get current user avatar | ✅ |
| GET | `/profile/avatar/:userId` | Get user avatar by ID | ✅ |

#### Room Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/room/create` | Create new room | ✅ |
| POST | `/room/join/:roomId` | Join existing room | ✅ |
| GET | `/room/:roomId` | Get room details | ✅ |
| DELETE | `/room/:roomId/end` | End room (host only) | ✅ |
| POST | `/room/:roomId/leave` | Leave room | ✅ |
| GET | `/room/user/rooms` | Get user's rooms | ✅ |

#### AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/chat` | Send message to AI | ✅ |
| GET | `/ai/status` | Check AI service status | ❌ |

#### Request/Response Examples

**Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "user": {
    "id": "65e1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-03-08T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Create Room**
```bash
POST /api/room/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Meeting",
  "settings": {
    "maxParticipants": 10,
    "screenSharingEnabled": true
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "roomId": "abc123def456",
    "name": "Team Meeting",
    "host": "65e1234567890abcdef12345",
    "createdAt": "2024-03-08T12:00:00.000Z"
  }
}
```

### 🚀 Installation

#### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- Git

#### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/AhmedLyanov/VizorLite.git
cd VizorLite
```

2. **Configure environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

3. **Start all services**
```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:4000
- Backend: http://localhost:3000
- MongoDB: mongodb://localhost:27017

#### Local Development

1. **Install backend dependencies**
```bash
cd backend
npm install
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Start backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

4. **Start frontend**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 📁 Project Structure

```
VizorLite/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── backend/
│   ├── controllers/
│   │   ├── ai.controller.js    # AI chat logic
│   │   ├── profile.controller.js # Profile management
│   │   ├── room.controller.js  # Room operations
│   │   └── user.controller.js  # Auth operations
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── models/
│   │   ├── Room.model.js       # Room schema
│   │   └── User.model.js       # User schema
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── profile.routes.js
│   │   ├── room.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   └── websocket.service.js # Socket.IO handler
│   ├── utils/
│   │   └── jwt.js              # JWT utilities
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.js                # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/
│   │   │   ├── providers/
│   │   │   └── router/
│   │   ├── entities/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── shared/
│   │   └── widgets/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── cover.png
├── docker-compose.yml
├── LICENSE
└── README.md
```

### 👨‍💻 Development

#### Available Scripts

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

**Frontend**
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

#### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vizorlite
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Frontend (.env.development)**
```env
VITE_API_URL=http://localhost:3000
```

#### WebSocket Events

**Client → Server**
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId, userId, userName }` | Join a room |
| `offer` | `{ offer, to }` | WebRTC offer |
| `answer` | `{ answer, to }` | WebRTC answer |
| `ice-candidate` | `{ candidate, to }` | ICE candidate |

**Server → Client**
| Event | Payload | Description |
|-------|---------|-------------|
| `user-connected` | `{ socketId, userId, userName }` | New user joined |
| `user-disconnected` | `{ socketId }` | User left |
| `existing-users` | `{ users: [] }` | List of existing users |
| `offer` | `{ offer, from }` | WebRTC offer |
| `answer` | `{ answer, from }` | WebRTC answer |
| `ice-candidate` | `{ candidate, from }` | ICE candidate |

### 🚢 Deployment

#### Docker Deployment

1. **Build and run**
```bash
docker-compose up -d --build
```

2. **View logs**
```bash
docker-compose logs -f
```

3. **Stop services**
```bash
docker-compose down
```

#### CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

1. Push to `main` branch triggers deployment
2. Code is deployed via SSH to production server
3. Backend is managed with PM2
4. Frontend is built and served by Nginx

**Required Secrets:**
- `SERVER_HOST` - Server IP/hostname
- `SERVER_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key

### 🗺️ Roadmap

#### Completed ✅
- User authentication (register/login)
- Profile management with avatars
- Video conferencing (WebRTC)
- Room management
- Screen sharing
- AI Assistant integration
- Multi-language support (7 languages)
- PWA support
- Docker containerization
- CI/CD pipeline

#### In Progress 🚧
- In-meeting chat
- Meeting recording
- Password recovery
- Email verification

#### Planned 📋
- Subscription system (Stripe)
- Meeting scheduling
- Calendar integration
- Push notifications
- Admin dashboard
- Analytics and statistics
- Virtual backgrounds
- Meeting transcription
- 2FA authentication

### 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

#### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure linting passes (`npm run lint`)

### 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### 👥 Authors

- **Ahmed** - Main developer

### 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/AhmedLyanov/VizorLite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AhmedLyanov/VizorLite/discussions)

---

## Русская версия <a name="ru"></a>

VizorLite — это современное веб-приложение для видеоконференций, которое позволяет пользователям легко создавать и присоединяться к видеовстречам без необходимости установки дополнительного программного обеспечения или регистрации. Платформа ориентирована на простоту использования, доступность и конфиденциальность.

### 📖 Содержание

- [Основные возможности](#-основные-возможности)
- [Технологический стек](#-технологический-стек)
- [Архитектура](#-архитектура)
- [API документация](#-api-документация)
- [Установка](#-установка)
- [Структура проекта](#-структура-проекта)
- [Разработка](#-разработка)
- [Развёртывание](#-развёртывание)
- [Вклад в проект](#-вклад-в-проект)
- [Лицензия](#-лицензия)

### ✨ Основные возможности

#### Базовый функционал
- **🎥 Видеовстречи**: Создание и участие в видеоконференциях мгновенно
- **🔗 Легкий вход**: Присоединение по уникальной ссылке или ID комнаты
- **👥 Мультиплеер**: Поддержка до 10 участников в комнате (настраивается)
- **🔐 Безопасность**: JWT-аутентификация
- **👤 Профили**: Управление профилем с загрузкой аватара

#### Коммуникация
- **📡 WebRTC**: P2P видео/аудио соединения
- **🔌 WebSocket**: Socket.IO для сигналинга
- **🖥️ Демонстрация экрана**: Показ экрана участникам
- **🎤 Управление медиа**: Включение/выключение камеры и микрофона

#### AI и Интернационализация
- **🤖 AI-ассистент "Маркус":** Умный чат-бот для поддержки
- **🌍 Многоязычность**: 7 языков (EN, RU, DE, JP, CN, FR, AR)
- **📱 PWA**: Установка как Progressive Web App

#### Пользовательский опыт
- **🎨 Современный UI**: Компоненты Ant Design
- **📱 Адаптивность**: Мобильные и десктопные устройства
- **⚡ Скорость**: Vite с lazy loading
- **🔔 Уведомления**: Обратная связь действий

### 🛠️ Технологический стек

#### Backend
| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | 20 | Платформа выполнения |
| Express.js | 5.2.1 | Веб-фреймворк |
| MongoDB | 7 | База данных |
| Mongoose | 9.1.2 | MongoDB ODM |
| Socket.IO | 4.8.3 | WebSocket сервер |
| JWT | 9.0.3 | Аутентификация |
| bcryptjs | 3.0.3 | Хеширование паролей |
| sharp | 0.34.5 | Обработка изображений |
| multer | 2.1.0 | Загрузка файлов |

#### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 19.2.0 | UI библиотека |
| TypeScript | 5.9.3 | Типизация |
| Vite | 7.2.4 | Сборщик |
| React Router | 7.11.0 | Маршрутизация |
| Zustand | 5.0.9 | Управление состоянием |
| React Intl | 8.0.11 | i18n |
| Ant Design | 6.1.4 | UI компоненты |
| TanStack Query | 5.90.20 | Серверное состояние |
| Socket.IO Client | 4.8.3 | WebSocket клиент |
| simple-peer | 9.11.1 | WebRTC обёртка |

#### Инфраструктура
| Технология | Назначение |
|------------|------------|
| Docker | Контейнеризация |
| Docker Compose | Оркестрация |
| Nginx | Веб-сервер |
| GitHub Actions | CI/CD |
| PM2 | Процесс-менеджер |

### 🏗️ Архитектура

#### Общая схема
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│   MongoDB   │
│  (React TS) │◀────│ (Express.js) │◀────│  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │   WebSocket        │
       └───────────────────▶│
       │   (Socket.IO)      │
       │                    │
       └────────────────────┘
           WebRTC P2P
```

### 📡 API документация

#### Базовый URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

#### Endpoints аутентификации

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/auth/register` | Регистрация | ❌ |
| POST | `/auth/login` | Вход | ❌ |
| GET | `/auth/profile` | Получить профиль | ✅ |
| PUT | `/auth/profile` | Обновить профиль | ✅ |
| DELETE | `/auth/account` | Удалить аккаунт | ✅ |

#### Endpoints профиля

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/profile/avatar` | Загрузить аватар | ✅ |
| DELETE | `/profile/avatar` | Удалить аватар | ✅ |
| GET | `/profile/avatar` | Получить аватар | ✅ |
| GET | `/profile/avatar/:userId` | Получить аватар по ID | ✅ |

#### Endpoints комнат

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/room/create` | Создать комнату | ✅ |
| POST | `/room/join/:roomId` | Войти в комнату | ✅ |
| GET | `/room/:roomId` | Информация о комнате | ✅ |
| DELETE | `/room/:roomId/end` | Завершить комнату | ✅ |
| POST | `/room/:roomId/leave` | Покинуть комнату | ✅ |
| GET | `/room/user/rooms` | Комнаты пользователя | ✅ |

#### AI Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/ai/chat` | Отправить сообщение AI | ✅ |
| GET | `/ai/status` | Статус AI сервиса | ❌ |

### 🚀 Установка

#### Требования
- Node.js >= 18
- Docker & Docker Compose
- Git

#### Быстрый старт с Docker

1. **Клонировать репозиторий**
```bash
git clone https://github.com/AhmedLyanov/VizorLite.git
cd VizorLite
```

2. **Настроить переменные окружения**
```bash
cd backend
cp .env.example .env
# Отредактируйте .env
```

3. **Запустить все сервисы**
```bash
docker-compose up --build
```

Доступ:
- Frontend: http://localhost:4000
- Backend: http://localhost:3000
- MongoDB: mongodb://localhost:27017

#### Локальная разработка

1. **Установить зависимости backend**
```bash
cd backend
npm install
```

2. **Установить зависимости frontend**
```bash
cd frontend
npm install
```

3. **Запустить backend**
```bash
cd backend
npm run dev
```

4. **Запустить frontend**
```bash
cd frontend
npm run dev
```

### 👨‍💻 Разработка

#### Доступные скрипты

**Backend**
```bash
npm start          # Production сервер
npm run dev        # Development сервер
```

**Frontend**
```bash
npm run dev        # Vite dev server
npm run build      # Production сборка
npm run preview    # Preview сборки
npm run lint       # ESLint
```

#### Переменные окружения

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vizorlite
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Frontend (.env.development)**
```env
VITE_API_URL=http://localhost:3000
```

### 🚢 Развёртывание

#### Docker
```bash
docker-compose up -d --build
```

#### CI/CD

GitHub Actions автоматически деплоит при пуше в `main`:
- Деплой через SSH на production сервер
- Backend управляется через PM2
- Frontend обслуживается Nginx

**Необходимые Secrets:**
- `SERVER_HOST` - IP/hostname сервера
- `SERVER_USER` - SSH пользователь
- `SSH_PRIVATE_KEY` - SSH приватный ключ

### 🗺️ Roadmap

#### Выполнено ✅
- Аутентификация (регистрация/вход)
- Управление профилем с аватарами
- Видеоконференции (WebRTC)
- Управление комнатами
- Демонстрация экрана
- AI-ассистент
- Многоязычность (7 языков)
- PWA поддержка
- Docker контейнеризация
- CI/CD пайплайн

#### В процессе 🚧
- Чат во время встреч
- Запись встреч
- Восстановление пароля
- Подтверждение email

#### Запланировано 📋
- Система подписок (Stripe)
- Планирование встреч
- Интеграция с календарём
- Push-уведомления
- Админ панель
- Аналитика и статистика
- Виртуальные фоны
- Транскрибация встреч
- 2FA аутентификация

### 🤝 Вклад в проект

Приветствуется любой вклад в развитие проекта!

1. **Форкнуть репозиторий**
2. **Создать ветку**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Закоммитить изменения**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Отправить в репозиторий**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Создать Pull Request**

### 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для деталей.

### 👥 Авторы

- **Ahmed** - основной разработчик

### 📞 Контакты

- **Issues**: [GitHub Issues](https://github.com/AhmedLyanov/VizorLite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AhmedLyanov/VizorLite/discussions)

<p align="right">(<a href="#readme-top">наверх</a>)</p>

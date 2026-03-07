<a name="readme-top"></a>

# VizorLite

<div align="center">
  <img src="docs/cover.png" alt="VizorLite Cover" width="800">
  
  [English](#en) | [Русский](#ru)
</div>

---

## English Version <a name="en"></a>

VizorLite is a modern video conferencing web application that allows users to easily create and join video meetings without the need for additional software installation or registration. The platform focuses on simplicity, accessibility, and privacy.

### Project Description

VizorLite is a full-featured video conferencing application consisting of two main components: a React-based frontend and a Node.js backend. The project is designed with principles of accessibility, security, and ease of use in mind, allowing users to quickly start video calls without complex setups.

### Key Features

- **Create Video Meetings**: Users can easily create new video conferences
- **Join Meetings**: Ability to join existing meetings via link
- **Account Management**: Registration, authorization, and profile management
- **Multilingual Support**: Support for multiple languages (Russian, English, Japanese)
- **Pricing Plans**: Different plans for various needs (Basic, Business, Premium)
- **Mobile Version**: Capability to install as a PWA application
- **Real-time Communication**: WebSocket-based peer-to-peer connections
- **AI Assistant**: Integrated "Marcus" assistant for user support
- **Screen Sharing**: Screen sharing capabilities for presentations
- **Chat Functionality**: Real-time messaging during conferences

### Architecture

The project is divided into two main parts:

#### Backend (Server Side)

- **Programming Language**: JavaScript (ES6+)
- **Framework**: Express.js (version 5.2.1)
- **Database**: MongoDB (using Mongoose ORM)
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **Server**: Node.js
- **Build and Deployment**: Docker

##### Main Modules:
- **Controllers**: Request processing and application logic
- **Models**: Data structure and database interaction
- **Routes**: API route definitions
- **Middleware**: Middleware (authentication, logging)
- **Services**: WebSocket services for real-time communication
- **Utils**: Utility functions (JWT, other utilities)

##### API Endpoints:
- `/api/auth/register` - Register a new user
- `/api/auth/login` - User login
- `/api/auth/profile` - Get user profile (requires authentication)
- `/api/auth/profile` - Update user profile (requires authentication)
- `/api/auth/account` - Delete user account (requires authentication)
- `/api/room/create` - Create a new room (requires authentication)
- `/api/room/join/:roomId` - Join a room (requires authentication)
- `/api/room/:roomId` - Get room details (requires authentication)
- `/api/room/:roomId/end` - End a room (requires authentication)
- `/api/room/:roomId/leave` - Leave a room (requires authentication)
- `/api/room/user/rooms` - Get user rooms (requires authentication)
- `/api/ai/chat` - AI assistant chat (requires authentication)
- `/api/ai/status` - AI service status

#### Frontend (Client Side)

- **Programming Language**: TypeScript
- **Framework**: React (version 19.2.0)
- **Routing**: React Router DOM
- **UI Library**: Ant Design
- **State Management**: Zustand
- **Internationalization**: react-intl
- **Build Tool**: Vite
- **Server**: Nginx (in Docker container)

##### Main Components:
- **Pages**: Application views (Home, About, Pricing, 404)
- **Features**: Feature-specific components
- **Widgets**: Reusable UI components
- **Entities**: Domain-specific logic
- **Shared**: Shared utilities and components
- **Providers**: Context providers (localization, authentication)
- **i18n**: Localization files

### Technologies Used

#### Backend:
- **Node.js** - Server platform
- **Express.js** - Web framework
- **MongoDB** - Document-oriented database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Socket.IO** - Real-time communication
- **Dotenv** - Environment variable management
- **Nodemon** - Automatic server reload during development

#### Frontend:
- **React** - Library for building user interfaces
- **TypeScript** - Strict typing
- **React Router** - Page navigation
- **Ant Design** - UI component library
- **Zustand** - State management
- **React Intl** - Internationalization
- **Vite** - Project bundler
- **Simple Peer** - WebRTC connections
- **Socket.IO Client** - Real-time communication client

#### Infrastructure:
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Nginx** - Web server for frontend

### Installation and Setup

#### Requirements:
- Node.js (version 18 or higher)
- Docker and Docker Compose
- MongoDB (locally or via Docker)

#### Local Development:

1. Clone the repository:
```bash
git clone https://github.com/AhmedLyanov/VizorLite.git
cd VizorLite
```

2. Install dependencies for backend and frontend:
```bash
# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory based on the `.env.example` file:
```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/vizorlite
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:4000
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
```

4. Run the application with Docker Compose:
```bash
docker-compose up --build
```

After running:
- Frontend will be available at http://localhost:4000
- Backend will be available at http://localhost:3000

### Project Structure

```
VizorLite/
├── backend/                 # Server-side application
│   ├── controllers/         # Controllers for request processing
│   ├── middleware/          # Middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── services/            # Services (WebSocket, etc.)
│   ├── utils/               # Utility functions
│   ├── index.js             # Main server file
│   ├── package.json         # Dependencies and scripts
│   └── Dockerfile           # Docker build file
├── frontend/                # Client-side application
│   ├── src/
│   │   ├── app/             # Main application structure
│   │   ├── entities/        # Domain-specific logic
│   │   ├── features/        # Feature-specific components
│   │   ├── pages/           # Application pages
│   │   ├── shared/          # Shared utilities and components
│   │   └── widgets/         # Reusable UI components
│   ├── index.html           # Main HTML page
│   ├── package.json         # Dependencies and scripts
│   └── Dockerfile           # Docker build file
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # Project documentation
```

### Application Features

1. **Ease of Use**: Users can start a video call without registration
2. **Privacy**: All user data is protected and not shared with third parties
3. **Multilingual**: Support for Russian, English, and Japanese languages
4. **Responsive Design**: Application displays correctly on various devices
5. **AI Integration**: Built-in assistant "Marcus" for user assistance
6. **Pricing Plans**: Various subscription options depending on needs
7. **Real-time Communication**: WebSocket-based peer-to-peer connections
8. **Screen Sharing**: Screen sharing capabilities for presentations

### Security

- Passwords are hashed using bcrypt
- Authentication is implemented using JWT tokens
- All sensitive data is stored in environment variables
- Input validation on the server side

### Contributing

If you want to contribute to the project:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some NewFeature'`)
4. Push to the remote branch (`git push origin feature/NewFeature`)
5. Create a Pull Request

### License

This project is licensed under the ISC License. See the LICENSE file for details.

### Authors

- **Ahmed** - Main developer

### Contact

For contacting the project team, use the Issues section in the GitHub repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Русская версия <a name="ru"></a>

VizorLite — это современное веб-приложение для видеоконференций, которое позволяет пользователям легко создавать и присоединяться к видеовстречам без необходимости установки дополнительного программного обеспечения или регистрации. Платформа ориентирована на простоту использования, доступность и конфиденциальность.

### Описание проекта

VizorLite представляет собой полнофункциональное приложение для видеоконференций, состоящее из двух основных компонентов: фронтенд на основе React и бэкенд на Node.js. Проект разработан с учетом принципов доступности, безопасности и простоты использования, позволяя пользователям быстро начинать видеозвонки без сложных настроек.

### Основные возможности

- **Создание видеовстреч**: Пользователи могут легко создавать новые видеоконференции
- **Присоединение к встречам**: Возможность присоединяться к существующим встречам по ссылке
- **Управление аккаунтом**: Регистрация, авторизация и управление профилем пользователя
- **Многоязычность**: Поддержка нескольких языков (русский, английский, японский)
- **Тарифные планы**: Различные тарифы для разных потребностей (базовый, бизнес, премиум)
- **Мобильная версия**: Возможность установки как PWA-приложения
- **Реальное время**: Соединения на основе WebSocket
- **AI-ассистент**: Встроенный помощник "Маркус" для поддержки пользователей
- **Демонстрация экрана**: Возможности демонстрации экрана для презентаций
- **Функция чата**: Обмен сообщениями в реальном времени во время конференций

### Архитектура

Проект разделен на две основные части:

#### Backend (серверная часть)

- **Язык программирования**: JavaScript (ES6+)
- **Фреймворк**: Express.js (версия 5.2.1)
- **База данных**: MongoDB (с использованием Mongoose ORM)
- **Аутентификация**: JWT-токены
- **Хэширование паролей**: bcrypt
- **Сервер**: Node.js
- **Сборка и развертывание**: Docker

##### Основные модули:
- **Controllers**: Обработка запросов и логика приложения
- **Models**: Структура данных и взаимодействие с базой данных
- **Routes**: Определение маршрутов API
- **Middleware**: Промежуточное ПО (аутентификация, логирование)
- **Services**: Сервисы (WebSocket и др.)
- **Utils**: Вспомогательные функции (JWT, другие утилиты)

##### API endpoints:
- `/api/auth/register` - регистрация нового пользователя
- `/api/auth/login` - вход пользователя в систему
- `/api/auth/profile` - получение профиля пользователя (требует аутентификации)
- `/api/auth/profile` - обновление профиля пользователя (требует аутентификации)
- `/api/auth/account` - удаление аккаунта пользователя (требует аутентификации)
- `/api/room/create` - создание новой комнаты (требует аутентификации)
- `/api/room/join/:roomId` - присоединение к комнате (требует аутентификации)
- `/api/room/:roomId` - получение информации о комнате (требует аутентификации)
- `/api/room/:roomId/end` - завершение комнаты (требует аутентификации)
- `/api/room/:roomId/leave` - покинуть комнату (требует аутентификации)
- `/api/room/user/rooms` - получить комнаты пользователя (требует аутентификации)
- `/api/ai/chat` - чат с AI-ассистентом (требует аутентификации)
- `/api/ai/status` - статус сервиса AI

#### Frontend (клиентская часть)

- **Язык программирования**: TypeScript
- **Фреймворк**: React (версия 19.2.0)
- **Маршрутизация**: React Router DOM
- **UI библиотека**: Ant Design
- **Управление состоянием**: Zustand
- **Интернационализация**: react-intl
- **Сборка**: Vite
- **Сервер**: Nginx (в контейнере Docker)

##### Основные компоненты:
- **Pages**: Страницы приложения (Главная, О нас, Тарифы, 404)
- **Features**: Компоненты, специфичные для функций
- **Widgets**: Переиспользуемые компоненты UI
- **Entities**: Логика, специфичная для домена
- **Shared**: Общие утилиты и компоненты
- **Providers**: Провайдеры контекста (локализация, аутентификация)
- **i18n**: Файлы локализации

### Используемые технологии

#### Backend:
- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **MongoDB** - документоориентированная база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - токены для аутентификации
- **Bcrypt** - хэширование паролей
- **Socket.IO** - коммуникация в реальном времени
- **Dotenv** - управление переменными окружения
- **Nodemon** - автоматическая перезагрузка сервера при разработке

#### Frontend:
- **React** - библиотека для создания пользовательских интерфейсов
- **TypeScript** - строгая типизация
- **React Router** - навигация между страницами
- **Ant Design** - библиотека компонентов UI
- **Zustand** - управление состоянием
- **React Intl** - интернационализация
- **Vite** - сборщик проекта
- **Simple Peer** - соединения WebRTC
- **Socket.IO Client** - клиент коммуникации в реальном времени

#### Инфраструктура:
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация контейнеров
- **Nginx** - веб-сервер для фронтенда

### Установка и настройка

#### Требования:
- Node.js (версия 18 или выше)
- Docker и Docker Compose
- MongoDB (локально или через Docker)

#### Локальная разработка:

1. Клонируйте репозиторий:
```bash
git clone https://github.com/AhmedLyanov/VizorLite.git
cd VizorLite
```

2. Установите зависимости для backend и frontend:
```bash
# Установка зависимостей для backend
cd backend
npm install

# Установка зависимостей для frontend
cd ../frontend
npm install
```

3. Настройте переменные окружения:
Создайте файл `.env` в директории backend на основе файла `.env.example`:
```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/vizorlite
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:4000
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
```

4. Запустите приложение с помощью Docker Compose:
```bash
docker-compose up --build
```

После запуска:
- Frontend будет доступен по адресу http://localhost:4000
- Backend будет доступен по адресу http://localhost:3000

### Структура проекта

```
VizorLite/
├── backend/                 # Серверная часть приложения
│   ├── controllers/         # Контроллеры для обработки запросов
│   ├── middleware/          # Промежуточное ПО
│   ├── models/              # Модели данных
│   ├── routes/              # Маршруты API
│   ├── services/            # Сервисы (WebSocket и др.)
│   ├── utils/               # Вспомогательные функции
│   ├── index.js             # Главный файл сервера
│   ├── package.json         # Зависимости и скрипты
│   └── Dockerfile           # Файл для сборки Docker-образа
├── frontend/                # Клиентская часть приложения
│   ├── src/
│   │   ├── app/             # Основная структура приложения
│   │   ├── entities/        # Логика, специфичная для домена
│   │   ├── features/        # Компоненты, специфичные для функций
│   │   ├── pages/           # Страницы приложения
│   │   ├── shared/          # Общие утилиты и компоненты
│   │   └── widgets/         # Переиспользуемые компоненты UI
│   ├── index.html           # Главная HTML-страница
│   ├── package.json         # Зависимости и скрипты
│   └── Dockerfile           # Файл для сборки Docker-образа
├── docker-compose.yml       # Конфигурация Docker Compose
└── README.md                # Документация проекта
```

### Особенности приложения

1. **Простота использования**: Пользователи могут начать видеозвонок без регистрации
2. **Конфиденциальность**: Все данные пользователей защищены и не передаются третьим лицам
3. **Многоязычность**: Поддержка русского, английского и японского языков
4. **Адаптивный дизайн**: Приложение корректно отображается на различных устройствах
5. **Интеграция с AI**: Встроенный помощник "Маркус" для помощи пользователям
6. **Тарифные планы**: Различные варианты подписки в зависимости от потребностей
7. **Реальное время**: Соединения на основе WebSocket
8. **Демонстрация экрана**: Возможности демонстрации экрана для презентаций

### Безопасность

- Пароли хэшируются с использованием bcrypt
- Аутентификация реализована с помощью JWT-токенов
- Все чувствительные данные хранятся в переменных окружения
- Валидация входных данных на сервере

### Вклад в развитие проекта

Если вы хотите внести свой вклад в развитие проекта:

1. Сделайте форк репозитория
2. Создайте новую ветку для вашей функции (`git checkout -b feature/NewFeature`)
3. Зафиксируйте изменения (`git commit -m 'Add some NewFeature'`)
4. Отправьте изменения в удаленную ветку (`git push origin feature/NewFeature`)
5. Создайте Pull Request

### Лицензия

Этот проект распространяется под лицензией ISC. Подробности см. в файле LICENSE.

### Авторы

- **Ahmed** - основной разработчик

### Контакты

Для связи с командой проекта используйте раздел Issues в репозитории GitHub.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

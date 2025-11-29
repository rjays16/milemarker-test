Todo Application

Tech Stack: Laravel 11 + Vue.js 3 + MySQL + Tailwind CSS

---

Features

- User registration and authentication
- Create, read, update, and delete todos
- Organize todos with color-coded categories
- Set due dates for tasks
- Search and filter todos
- Mark todos as complete/incomplete
- Clean, responsive design

---

Prerequisites

Before you begin, make sure you have installed:

- PHP 8.2 or higher
- Composer
- Node.js 22.19.0 and NPM
- MySQL 8.0+
- Git

---

Quick Setup

Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/milemarker-test.git
cd milemarker-test
```

---

Backend Setup (Laravel)

Navigate to backend folder:

```bash
cd backend-todo
```

Install dependencies:

```bash
composer install
```

Create environment file:

```bash
cp .env.example .env
```

Configure database in .env

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo_app
DB_USERNAME=root
DB_PASSWORD=
```

Generate application key:

```bash
php artisan key:generate
```

Create database:

- Open phpMyAdmin or MySQL CLI
- Create a new database named `todo_app`

Run migrations and seed data:

```bash
php artisan migrate
php artisan db:seed --class=CategorySeeder
```

Start backend server:

```bash
php artisan serve
```

Backend is now running at `http://localhost:8000`

---

Frontend Setup (Vue.js)

Open a new terminal and navigate to frontend folder:

```bash
cd frontend-todo
```

Install dependencies:

```bash
npm install
```

Create environment file:

Create a new file called .env with this content:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Start frontend server:

```bash
npm run dev
```

Frontend is now running at `http://localhost:5173`

---

Using the Application

Login Credentials

After running the seeder, you can login with:

- Email: test@example.com
- Password: password

Or Create Your Own Account

1. Open `http://localhost:5173`
2. Click "Sign up"
3. Fill in your details
4. Start creating todos!

---

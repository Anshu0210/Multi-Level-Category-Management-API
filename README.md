# 🗂️ Multi-Level Category Management API

A RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** to manage hierarchical categories with authentication, tree retrieval, and business logic for status and deletion handling.

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** (JSON Web Tokens) for Authentication

---

## 📚 Features

### 🛡️ Authentication

- Register new users
- Login and receive JWT
- Protect routes via middleware

### 🌳 Category Management

- Create categories (with optional parent)
- Fetch all categories in a **nested tree structure**
- Update a category (name or status)
- Delete a category and reassign its children to its parent
- Set category status to inactive and cascade to subcategories

---

## 📐 Business Logic Rules

- Categories form a **tree-like structure**
- **Deleting a parent** reassigns children to the parent’s parent
- **Deactivating a category** recursively sets all its subcategories to inactive
- Optimized **bulk operations** to handle deep trees efficiently

---



---

## 🔗 API Endpoints

| Method | Route                           | Description                                           | Auth Required |
|--------|---------------------------------|-------------------------------------------------------|---------------|
| POST   | `/api/auth/register`            | Register a new user                                   | ❌            |
| POST   | `/api/auth/login`               | Authenticate and return JWT token                     | ❌            |
| POST   | `/api/category/create`          | Create a new category (optional parent)               | ✅            |
| GET    | `/api/category/list`            | Fetch all categories in nested tree format            | ✅            |
| PUT    | `/api/category/update/:id`      | Update category (name or status)                      | ✅            |
| DELETE | `/api/category/delete/:id`      | Delete category & reassign children to its parent     | ✅            |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anshu0210/Multi-Level-Category-Management-API.git
cd category-api


2. Install dependencies
npm install


3. Environment Setup
Create a .env file:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/category-api
JWT_SECRET=your_jwt_secret


4. Run the server
npm run dev

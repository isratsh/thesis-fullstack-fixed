# 🎓 Smart Thesis System — Full Stack

## Project Structure
```
thesis-tracker/   ← React Frontend
thesis-backend/   ← Node.js + Express + MongoDB Backend
```

---

## 🚀 Quick Start

### Step 1: Setup Backend
```bash
cd thesis-backend
npm install
```

Edit `.env` file and set your MongoDB URI:
```
MONGO_URI=mongodb://localhost:27017/thesis_system
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Step 2: Seed Demo Data
```bash
node seed.js
```

Demo accounts created:
| Role       | User ID      | Password     |
|------------|--------------|--------------|
| Admin      | ADMIN-001    | admin123     |
| Supervisor | SUP-001      | sup123       |
| Supervisor | SUP-002      | sup123       |
| Student    | 2021-CS-045  | student123   |
| Student    | 2021-CS-046  | student123   |
| Student    | 2021-CS-047  | student123   |

### Step 3: Start Backend
```bash
npm run dev     # with nodemon (auto-restart)
# OR
npm start       # production
```
Backend runs at: http://localhost:5000

### Step 4: Setup Frontend
```bash
cd thesis-tracker
npm install
```

### Step 5: Start Frontend
```bash
npm start
```
Frontend runs at: http://localhost:3000

---

## 📡 API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/login                   | Login                    |
| POST   | /api/auth/register                | Register                 |
| GET    | /api/auth/me                      | Get current user         |
| PUT    | /api/auth/update-profile          | Update profile           |
| PUT    | /api/auth/change-password         | Change password          |
| GET    | /api/auth/notifications           | Get notifications        |
| GET    | /api/thesis/my                    | Student: get own thesis  |
| GET    | /api/thesis/all                   | Supervisor: all theses   |
| POST   | /api/thesis                       | Create thesis            |
| POST   | /api/thesis/:id/chapter           | Submit chapter (+ file)  |
| PUT    | /api/thesis/:id/chapter/:cid/review | Review chapter         |
| GET    | /api/users                        | Admin: all users         |
| PUT    | /api/users/:id/assign-supervisor  | Assign supervisor        |
| GET    | /api/meetings                     | Get meetings             |
| POST   | /api/meetings                     | Book meeting             |
| GET    | /api/announcements                | Get announcements        |
| POST   | /api/announcements                | Create announcement      |

---

## 🛠️ Tech Stack
- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **File Upload**: Multer


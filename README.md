# CollegeSphere - College Discovery Platform

A production-grade MVP for a college discovery and decision-making platform built with **Next.js**, **Express.js**, and **PostgreSQL**.

## Features

### 1. **College Listing + Search** 🔍
- Searchable college listings with pagination
- Filter by location, rating, fees
- Real-time search functionality
- 10 sample colleges pre-seeded

### 2. **College Detail Page** 📚
- Comprehensive college information
- Overview, courses, placements, fees
- Student and faculty counts
- 2024 placement statistics

### 3. **Compare Colleges** 📊
- Side-by-side comparison for 2-4 colleges
- Key metrics: fees, placements, ratings, location
- Save comparisons for authenticated users
- Clean comparison table

### 4. **Authentication** 🔐
- Email/Password signup and login with JWT
- Persistent session management
- Protected routes for authenticated users

### 5. **Saved Items** 💾
- Save favorite colleges
- Save comparisons
- Dedicated saved items page
- Persistent storage

## Tech Stack

### Backend
- **Node.js + Express.js** - RESTful API server
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **pg** - PostgreSQL driver

### Frontend
- **Next.js** - React framework
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **localStorage** - Client-side persistence

## Project Structure

```
Internship Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── College.js
│   │   │   ├── User.js
│   │   │   └── UserSavedItems.js
│   │   ├── controllers/
│   │   │   ├── collegeController.js
│   │   │   ├── authController.js
│   │   │   ├── compareController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── colleges.js
│   │   │   ├── auth.js
│   │   │   ├── compare.js
│   │   │   └── users.js
│   │   ├── scripts/
│   │   │   ├── migrate.js (Database schema)
│   │   │   └── seed.js (Sample data)
│   │   ├── app.js (Express setup)
│   │   └── index.js (Server entry)
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── pages/
    │   ├── _app.jsx
    │   ├── _document.jsx
    │   ├── index.jsx (Home)
    │   ├── colleges.jsx (Listing)
    │   ├── college/[id].jsx (Detail)
    │   ├── compare.jsx (Comparison)
    │   ├── login.jsx (Auth)
    │   ├── signup.jsx (Auth)
    │   └── saved.jsx (Saved items)
    ├── components/
    │   ├── Header.jsx
    │   ├── Layout.jsx
    │   ├── SearchBar.jsx
    │   └── CollegeCard.jsx
    ├── lib/
    │   └── api.js (API client)
    ├── store/
    │   └── index.js (Zustand stores)
    ├── styles/
    │   └── globals.css
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL (v12+)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your PostgreSQL credentials:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/collegedunia
JWT_SECRET=your_super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. **Create PostgreSQL database:**
```bash
psql -U postgres -c "CREATE DATABASE collegedunia;"
```

6. **Initialize database schema and seed data:**
```bash
npm run migrate && npm run seed
```

7. **Start the backend server:**
```bash
npm run dev
```

Server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env.local file:**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

4. **Start the development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## API Documentation

### Colleges Endpoints

#### List Colleges
```
GET /api/colleges?page=1&limit=10&search=&city=&sortBy=rating&order=DESC
```
**Response:**
```json
{
  "data": [{ "id": "uuid", "name": "IIT Delhi", "city": "New Delhi", "rating": 4.8, ... }],
  "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10 }
}
```

#### Get College Details
```
GET /api/colleges/:id
```

#### Search Colleges
```
GET /api/colleges/search?q=IIT&page=1&limit=10
```

#### Get Colleges by City
```
GET /api/colleges/city/:city?page=1&limit=10
```

### Authentication Endpoints

#### Signup
```
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

### Comparison Endpoints

#### Compare Colleges
```
POST /api/compare
{
  "collegeIds": ["id1", "id2", "id3"]
}
```

#### Save Comparison
```
POST /api/compare/save
Authorization: Bearer {token}
{
  "collegeIds": ["id1", "id2"],
  "name": "My Comparison"
}
```

#### Get Saved Comparisons
```
GET /api/compare/saved
Authorization: Bearer {token}
```

### User Endpoints

#### Get Saved Colleges
```
GET /api/users/saved-colleges?page=1&limit=10
Authorization: Bearer {token}
```

#### Save College
```
POST /api/users/save-college
Authorization: Bearer {token}
{
  "collegeId": "college-uuid"
}
```

#### Remove Saved College
```
DELETE /api/users/save-college/:collegeId
Authorization: Bearer {token}
```

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- google_id (VARCHAR, Optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Colleges Table
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- country (VARCHAR)
- rating (DECIMAL)
- total_reviews (INT)
- founded_year (INT)
- website (VARCHAR)
- created_at (TIMESTAMP)
```

### College Details Table
```sql
- college_id (Foreign Key to Colleges)
- description (TEXT)
- type (VARCHAR) - Private/Government
- student_count (INT)
- faculty_count (INT)
```

### Fees Table
```sql
- college_id (Foreign Key)
- program_name (VARCHAR)
- course_type (VARCHAR) - UG/PG
- annual_fee (DECIMAL)
```

### Courses Table
```sql
- college_id (Foreign Key)
- name (VARCHAR)
- duration (INT)
- degree_type (VARCHAR)
- seats (INT)
```

### Placements Table
```sql
- college_id (Foreign Key)
- year (INT)
- average_salary (DECIMAL)
- highest_salary (DECIMAL)
- placement_rate (DECIMAL)
```

### Saved Colleges Table
```sql
- user_id (Foreign Key)
- college_id (Foreign Key)
- created_at (TIMESTAMP)
```

## Key Features Implemented

### Backend
✅ RESTful API with proper HTTP methods  
✅ Input validation and error handling  
✅ JWT-based authentication  
✅ Database transactions for data integrity  
✅ Pagination for list endpoints  
✅ Advanced filtering (search, city, rating)  
✅ Proper indexing on frequently queried columns  

### Frontend
✅ Responsive design with Tailwind CSS  
✅ Client-side state management with Zustand  
✅ Protected authentication flows  
✅ Persistent session storage  
✅ Search and filter UI  
✅ Comparison interface  
✅ Saved items functionality  
✅ Error handling and loading states  

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run migrate && npm run seed  # First time only
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Sample Credentials

After running `npm run seed`, use any of these colleges to explore:

1. **IIT Delhi** - New Delhi (Rating: 4.8)
2. **IIT Bombay** - Mumbai (Rating: 4.9)
3. **Delhi University** - New Delhi (Rating: 4.5)
4. **BITS Pilani** - Pilani (Rating: 4.7)
5. **Ashoka University** - Sonipat (Rating: 4.6)

## Testing the Application

1. **Home Page:** Navigate to `/` to see the hero section
2. **Search:** Go to `/colleges` and try searching or filtering by city
3. **College Details:** Click on any college to see full details
4. **Authentication:** Try `/signup` and `/login`
5. **Compare:** After login, visit `/compare` to compare colleges
6. **Saved:** View your saved items at `/saved`

## Performance Optimizations

- Database indexes on frequently queried columns
- Pagination for large datasets
- Efficient API response structure
- Frontend image lazy loading potential
- Zustand for optimized state management

## Future Enhancements

- Reviews and ratings system
- Predictor tool (rank-based college recommendations)
- Q&A/Discussion forum
- OAuth integration (Google, GitHub)
- Advanced analytics dashboard
- Email notifications
- Mobile app
- Caching layer (Redis)

## Deployment

### Backend (Heroku/Railway/Render)
1. Add Procfile
2. Configure environment variables
3. Connect PostgreSQL addon
4. Deploy

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set environment variables
3. Auto-deploy on push

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for college discovery excellence**
